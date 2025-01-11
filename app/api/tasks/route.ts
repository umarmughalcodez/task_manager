import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const tasks = await prisma.tasks.findMany({});
    return NextResponse.json({
      tasks,
    });
  } catch (error: unknown) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({
      status: 400,
      message: "Failed to fetch tasks",
      error,
    });
  }
};

// Other methods can be updated similarly

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { content } = body;
    if (!content && typeof content !== "string") {
      return NextResponse.json({ status: 400, message: "Invalid credentials" });
    }
    const task = await prisma.tasks.create({
      data: {
        content,
      },
    });

    return NextResponse.json({
      status: 201,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      mesage: "Failed to fetch tasks",
      error,
    });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    // const url = req.nextUrl;
    // const taskId = url.searchParams.get("taskId");
    const body = await req.json();
    const { content, taskId } = body;

    if (!taskId) {
      return NextResponse.json({ status: 400, message: "Missing task Id" });
    }
    if (!content && typeof content !== "string") {
      return NextResponse.json({ status: 400, message: "Invalid credentials" });
    }

    const updatedTask = await prisma.tasks.update({
      where: {
        id: Number(taskId),
      },
      data: {
        content,
      },
    });
    return NextResponse.json({
      status: 200,
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "Failed to update task" },
      error.message
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const url = req.nextUrl;
    const taskId = Number(url.searchParams.get("taskId"));

    if (!taskId) {
      return NextResponse.json({
        status: 400,
        message: "Invalid or missing taskId",
      });
    }

    await prisma.tasks.delete({
      where: {
        id: Number(taskId),
      },
    });
    return NextResponse.json({
      status: 200,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "Failed to update task" },
      error.message
    );
  }
};
