import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Circle, Rect, RegularPolygon } from "react-konva";
import { FiCircle, FiSquare, FiTriangle, FiTrash2 } from "react-icons/fi";

const COLORS = {
  circle: "#f97316",
  rectangle: "#6366f1",
  triangle: "#14b8a6",
};

const toolBtn =
  "inline-flex cursor-pointer items-center gap-2 px-4 py-2 font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 hover:text-indigo-600";

export default function Shape() {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const addShape = (type) => {
    const id = Date.now();
    
    const col = prevLength => prevLength % 6; // 6 shapes per row
    const row = prevLength => Math.floor(prevLength / 6);

    setShapes((prev) => [
      ...prev,
      { id, type, x: 120 + col(prev.length) * 150,
        y: 120 + row(prev.length) * 140, },
    ]);
    setSelectedId(id);
  };

  const deleteShape = (id) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  };

  const updatePosition = (id, x, y) => {
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s)));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Shape Canvas</h1>

        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5">
          <button className={toolBtn} onClick={() => addShape("circle")}>
            <FiCircle size={18} /> Circle
          </button>
          <button className={toolBtn} onClick={() => addShape("rectangle")}>
            <FiSquare size={18} /> Rectangle
          </button>
          <button className={toolBtn} onClick={() => addShape("triangle")}>
            <FiTriangle size={18} /> Triangle
          </button>

          <span className="ml-auto px-2 text-sm text-slate-500">
            {shapes.length} {shapes.length === 1 ? "shape" : "shapes"}
          </span>

          <button
            disabled={!selectedId}
            onClick={() => deleteShape(selectedId)}
            className={`${toolBtn} hover:bg-rose-50 hover:border-rose-500 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 `}
          >
            <FiTrash2 size={18} /> Delete
          </button>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white bg-[radial-gradient(#d5d9e0_1px,transparent_1px)] bg-size-[24px_24px]"
        >
          {shapes.length === 0 && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-slate-400">
              Add a shape to get started
            </div>
          )}

          <Stage
            width={1050}
            height={540}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) setSelectedId(null);
            }}
          >
            <Layer>
              {shapes.map((shape) => {
                const selected = selectedId === shape.id;

                const common = {
                  x: shape.x,
                  y: shape.y,
                  draggable: true,
                  fill: COLORS[shape.type],
                  stroke: selected ? "#0f172a" : undefined,
                  strokeWidth: selected ? 3 : 0,
                  onClick: () => setSelectedId(shape.id),
                  onTap: () => setSelectedId(shape.id),
                  onDblClick: () => deleteShape(shape.id),
                  onDragStart: () => setSelectedId(shape.id),
                  onDragEnd: (e) =>
                    updatePosition(shape.id, e.target.x(), e.target.y()),
                };

                if (shape.type === "circle")
                  return <Circle key={shape.id} {...common} radius={45} />;

                if (shape.type === "rectangle")
                  return (
                    <Rect
                      key={shape.id}
                      {...common}
                      width={110}
                      height={80}
                      offsetX={55}
                      offsetY={40}
                      cornerRadius={12}
                    />
                  );
                  if (shape.type === "triangle")
                    return (
                    <RegularPolygon
                        key={shape.id}
                        {...common}
                        sides={3}
                        radius={60}
                    />
                );
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}