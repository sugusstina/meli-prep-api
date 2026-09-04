import {
    ORDER_STATUS,
    canTransitionOrderStatus
  } from "../../src/domain/order-status.js";
  
  import {
    describe,
    expect,
    test
  } from "vitest";
  
  describe("Order status transitions", () => {
    test.each([
      [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.PROCESSING,
        true
      ],
      [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.CANCELLED,
        true
      ],
      [
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.COMPLETED,
        true
      ],
  
      [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.COMPLETED,
        false
      ],
      [
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.CANCELLED,
        false
      ],
      [
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.PROCESSING,
        false
      ],
      [
        ORDER_STATUS.CANCELLED,
        ORDER_STATUS.PENDING,
        false
      ]
    ])(
      "%s -> %s returns %s",
      (
        currentStatus,
        nextStatus,
        expected
      ) => {
        expect(
          canTransitionOrderStatus(
            currentStatus,
            nextStatus
          )
        ).toBe(expected);
      }
    );
  
    test(
      "returns false for unknown current status",
      () => {
        expect(
          canTransitionOrderStatus(
            "unknown",
            ORDER_STATUS.PENDING
          )
        ).toBe(false);
      }
    );
  
    test(
      "does not allow transition to the same status",
      () => {
        expect(
          canTransitionOrderStatus(
            ORDER_STATUS.PENDING,
            ORDER_STATUS.PENDING
          )
        ).toBe(false);
      }
    );
  });