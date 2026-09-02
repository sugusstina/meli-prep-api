export const ORDER_STATUS = Object.freeze({
    PENDING: "pending",
    PROCESSING: "processing",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
  });
  
  export const ORDER_STATUS_TRANSITIONS =
    Object.freeze({
      [ORDER_STATUS.PENDING]: [
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.CANCELLED
      ],
  
      [ORDER_STATUS.PROCESSING]: [
        ORDER_STATUS.COMPLETED
      ],
  
      [ORDER_STATUS.COMPLETED]: [],
  
      [ORDER_STATUS.CANCELLED]: []
    });
  
  export function canTransitionOrderStatus(
    currentStatus,
    nextStatus
  ) {
    return (
      ORDER_STATUS_TRANSITIONS[
        currentStatus
      ]?.includes(nextStatus) ?? false
    );
  }