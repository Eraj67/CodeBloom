import { describe, expect, it, vi } from "vitest";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { AppError } from "../../src/lib/errors";
import { errorHandler, notFoundHandler } from "../../src/middleware/error.middleware";

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const req = {} as Request;
const next = (() => {}) as NextFunction;

describe("notFoundHandler", () => {
  it("returns a 404 JSON response", () => {
    const res = mockRes();
    notFoundHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Route not found" });
  });
});

describe("errorHandler", () => {
  it("maps ZodError to 400 with flattened field errors", () => {
    const schema = ZodError.create([
      { code: "invalid_string", path: ["email"], message: "Invalid email" },
    ]);
    const res = mockRes();
    errorHandler(schema, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Validation failed", details: expect.any(Object) })
    );
  });

  it("maps a file size MulterError to 400 with a clear message", () => {
    const error = new multer.MulterError("LIMIT_FILE_SIZE");
    const res = mockRes();
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "File too large. Maximum size is 5MB.",
    });
  });

  it("maps any other MulterError to 400 with its message", () => {
    const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE", "avatar");
    error.message = "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.";
    const res = mockRes();
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it("maps AppError to its status code and message", () => {
    const res = mockRes();
    errorHandler(new AppError(409, "Email already registered"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "Email already registered" });
  });

  it("maps AppError details when present", () => {
    const res = mockRes();
    errorHandler(new AppError(400, "Bad", { field: "x" }), req, res, next);
    expect(res.json).toHaveBeenCalledWith({ error: "Bad", details: { field: "x" } });
  });

  it("maps unknown errors to 500", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = mockRes();
    errorHandler(new Error("boom"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    spy.mockRestore();
  });
});