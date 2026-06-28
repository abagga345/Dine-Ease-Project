import { describe, it, expect } from "vitest";
import { UserSignup, checkout, address, review, otpVerifyEmail } from "../src/zodschema/schema";

describe("UserSignup schema", () => {
  const valid = {
    email: "user@example.com",
    firstName: "Asha",
    lastName: "Rao",
    contactNo: "9876543210",
    password: "secret123",
  };

  it("accepts a valid signup", () => {
    expect(UserSignup.safeParse(valid).success).toBe(true);
  });

  it("rejects a contact number that is not 10 digits", () => {
    expect(UserSignup.safeParse({ ...valid, contactNo: "123" }).success).toBe(false);
  });

  it("rejects a too-short password", () => {
    expect(UserSignup.safeParse({ ...valid, password: "abc" }).success).toBe(false);
  });
});

describe("checkout schema", () => {
  const valid = {
    storeId: "store-1",
    items: [{ id: 1, quantity: 2 }],
    amount: 297,
    addressId: 5,
    paymentMethod: "UPI",
  };

  it("accepts a valid checkout (description optional)", () => {
    expect(checkout.safeParse(valid).success).toBe(true);
  });

  it("rejects a non-positive quantity", () => {
    expect(checkout.safeParse({ ...valid, items: [{ id: 1, quantity: 0 }] }).success).toBe(false);
  });

  it("rejects an unknown payment method", () => {
    expect(checkout.safeParse({ ...valid, paymentMethod: "BITCOIN" }).success).toBe(false);
  });
});

describe("address + review + otp schemas", () => {
  it("validates a pincode length", () => {
    expect(address.safeParse({ houseStreet: "1 Road", state: "Delhi", pincode: "110001" }).success).toBe(true);
    expect(address.safeParse({ houseStreet: "1 Road", state: "Delhi", pincode: "12" }).success).toBe(false);
  });

  it("bounds the review rating to 0..5", () => {
    expect(review.safeParse({ rating: 5, description: "Great", itemId: 1 }).success).toBe(true);
    expect(review.safeParse({ rating: 9, description: "Great", itemId: 1 }).success).toBe(false);
  });

  it("requires a 6-char OTP", () => {
    expect(otpVerifyEmail.safeParse({ email: "a@b.com", otp: "123456" }).success).toBe(true);
    expect(otpVerifyEmail.safeParse({ email: "a@b.com", otp: "123" }).success).toBe(false);
  });
});
