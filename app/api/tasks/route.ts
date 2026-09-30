import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { isTaskStatus, validateTitle } from "@/lib/validation";
import { NewTask, Task } from "@/types/task";

export async function GET() {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, status, created_at FROM tasks ORDER BY created_at DESC, id DESC"
    );

    return NextResponse.json(rows as Task[]);
  } catch (error) {
    console.error("GET /api/tasks failed:", error);
    return NextResponse.json(
      { error: "Unable to load tasks." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<NewTask>;
    const titleError = validateTitle(body.title);

    if (titleError) {
      return NextResponse.json({ error: titleError }, { status: 400 });
    }

    const status = body.status ?? "todo";

    if (!isTaskStatus(status)) {
      return NextResponse.json(
        { error: "Invalid task status." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      "INSERT INTO tasks (title, status) VALUES (?, ?)",
      [body.title!.trim(), status]
    );

    const insertId = (result as { insertId: number }).insertId;

    const [rows] = await pool.execute(
      "SELECT id, title, status, created_at FROM tasks WHERE id = ?",
      [insertId]
    );

    const task = (rows as Task[])[0];

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks failed:", error);
    return NextResponse.json(
      { error: "Unable to create task." },
      { status: 500 }
    );
  }
}
