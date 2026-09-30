import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { isTaskStatus } from "@/lib/validation";
import { Task, UpdateTaskInput } from "@/types/task";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (id === null) {
      return NextResponse.json(
        { error: "Invalid task ID." },
        { status: 400 }
      );
    }

    const body = (await request.json()) as Partial<UpdateTaskInput>;

    if (!isTaskStatus(body.status)) {
      return NextResponse.json(
        { error: "Invalid task status." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [body.status, id]
    );

    const affectedRows = (result as { affectedRows: number }).affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    const [rows] = await pool.execute(
      "SELECT id, title, status, created_at FROM tasks WHERE id = ?",
      [id]
    );

    return NextResponse.json((rows as Task[])[0]);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] failed:", error);
    return NextResponse.json(
      { error: "Unable to update task." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (id === null) {
      return NextResponse.json(
        { error: "Invalid task ID." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

    const affectedRows = (result as { affectedRows: number }).affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] failed:", error);
    return NextResponse.json(
      { error: "Unable to delete task." },
      { status: 500 }
    );
  }
}