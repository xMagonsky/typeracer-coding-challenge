"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Player } from "../types/player";

type SortKey = keyof Pick<Player, "name" | "progress" | "avgWpm" | "avgAccuracy">;
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

interface PlayerTableProps {
  players: Player[];
}

const VALID_SORT_KEYS: SortKey[] = ["name", "progress", "avgWpm", "avgAccuracy"];
const VALID_SORT_DIRS: SortDir[] = ["asc", "desc"];

function parseSortKey(value: string | null): SortKey {
  return VALID_SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : "name";
}

function parseSortDir(value: string | null): SortDir {
  return VALID_SORT_DIRS.includes(value as SortDir) ? (value as SortDir) : "asc";
}

function parsePageSize(value: string | null): number {
  const n = Number(value);
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(n) ? n : 10;
}

function parsePage(value: string | null): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}

export function PlayerTable({ players }: PlayerTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sortKey = parseSortKey(searchParams.get("sortKey"));
  const sortDir = parseSortDir(searchParams.get("sortDir"));
  const page = parsePage(searchParams.get("page"));
  const pageSize = parsePageSize(searchParams.get("pageSize"));

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        params.set(key, value);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  // Sort
  const sorted = useMemo(() => {
    const copy = [...players];
    copy.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDir === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
    return copy;
  }, [players, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paginated = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      updateParams({ sortDir: sortDir === "asc" ? "desc" : "asc", page: "0" });
    } else {
      updateParams({ sortKey: key, sortDir: "asc", page: "0" });
    }
  }

  function sortIndicator(key: SortKey) {
    if (key !== sortKey) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  const thClass =
    "text-[#999] p-3 text-left text-sm font-semibold cursor-pointer select-none hover:text-white transition-colors";

  return (
    <div className="bg-[#2a2a2a] rounded-xl p-5 mb-8">
      <h2 className="text-white mb-4 text-2xl">Live Players</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-[#444]">
            <th className={thClass} onClick={() => handleSort("name")}>
              Player{sortIndicator("name")}
            </th>
            <th className={thClass} onClick={() => handleSort("progress")}>
              Progress{sortIndicator("progress")}
            </th>
            <th className={thClass} onClick={() => handleSort("avgWpm")}>
              Avg WPM{sortIndicator("avgWpm")}
            </th>
            <th className={thClass} onClick={() => handleSort("avgAccuracy")}>
              Avg Accuracy{sortIndicator("avgAccuracy")}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((player) => (
            <tr key={player.id} className="border-b border-[#333]">
              <td className="text-white p-3 text-base">{player.name}</td>
              <td className="p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-2 bg-[#1a1a1a] rounded overflow-hidden">
                    <div className="h-full bg-green-400 transition-all duration-300 ease-in-out" style={{ width: `${player.progress}%` }} />
                  </div>
                  <span className="text-[#999] text-sm min-w-11.25">{player.progress}%</span>
                </div>
              </td>
              <td className="text-blue-400 p-3 text-base">{player.avgWpm}</td>
              <td className="text-blue-400 p-3 text-base">{player.avgAccuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination & page-size controls */}
      <div className="flex items-center justify-between mt-4 text-sm text-[#999]">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              updateParams({ pageSize: e.target.value, page: "0" });
            }}
            className="bg-[#1a1a1a] text-white border border-[#444] rounded px-2 py-1 text-sm focus:outline-none"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span>
            {sorted.length === 0
              ? "0 of 0"
              : `${safePage * pageSize + 1}–${Math.min(safePage * pageSize + pageSize, sorted.length)} of ${sorted.length}`}
          </span>
          <button
            onClick={() => updateParams({ page: "0" })}
            disabled={safePage === 0}
            className="px-2 py-1 rounded bg-[#1a1a1a] border border-[#444] disabled:opacity-30 hover:bg-[#333] transition-colors"
          >
            ««
          </button>
          <button
            onClick={() => updateParams({ page: String(Math.max(0, safePage - 1)) })}
            disabled={safePage === 0}
            className="px-2 py-1 rounded bg-[#1a1a1a] border border-[#444] disabled:opacity-30 hover:bg-[#333] transition-colors"
          >
            «
          </button>
          <button
            onClick={() => updateParams({ page: String(Math.min(totalPages - 1, safePage + 1)) })}
            disabled={safePage >= totalPages - 1}
            className="px-2 py-1 rounded bg-[#1a1a1a] border border-[#444] disabled:opacity-30 hover:bg-[#333] transition-colors"
          >
            »
          </button>
          <button
            onClick={() => updateParams({ page: String(totalPages - 1) })}
            disabled={safePage >= totalPages - 1}
            className="px-2 py-1 rounded bg-[#1a1a1a] border border-[#444] disabled:opacity-30 hover:bg-[#333] transition-colors"
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
}
