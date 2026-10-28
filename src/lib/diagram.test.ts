import { describe, expect, it } from "vitest";
import { layers } from "./diagram";

const ids = (cols: { id: string }[][]) => cols.map((c) => c.map((n) => n.id));
const nodes = (...list: string[]) => list.map((id) => ({ id }));

describe("layers", () => {
  it("puts each node after the furthest node pointing to it", () => {
    // portfolio: two actors into the edge, then the worker, then storage.
    expect(
      ids(
        layers(nodes("visitor", "owner", "edge", "worker", "db", "r2"), [
          { from: "visitor", to: "edge" },
          { from: "owner", to: "edge" },
          { from: "edge", to: "worker" },
          { from: "worker", to: "db" },
          { from: "worker", to: "r2" },
        ]),
      ),
    ).toEqual([["visitor", "owner"], ["edge"], ["worker"], ["db", "r2"]]);
  });

  it("uses the longest path when a node has short and long inputs", () => {
    expect(
      ids(
        layers(nodes("pr", "action", "cli", "core"), [
          { from: "pr", to: "action" },
          { from: "action", to: "core" },
          { from: "cli", to: "core" },
        ]),
      ),
    ).toEqual([["pr", "cli"], ["action"], ["core"]]);
  });

  it("keeps unconnected nodes and survives a cycle", () => {
    const cols = layers(nodes("a", "b", "lone"), [
      { from: "a", to: "b" },
      { from: "b", to: "a" },
    ]);
    expect(
      cols
        .flat()
        .map((n) => n.id)
        .sort(),
    ).toEqual(["a", "b", "lone"]);
  });

  it("ignores edges to unknown nodes", () => {
    expect(ids(layers(nodes("a"), [{ from: "a", to: "ghost" }]))).toEqual([
      ["a"],
    ]);
  });
});
