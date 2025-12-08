import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const MSPerDay = 1000 * 60 * 60 * 24;

  const startDateInMS = new Date(rent_start_date as string).getTime();
  const endDateInMS = new Date(rent_end_date as string).getTime();
  const now = new Date().getTime();

  if (startDateInMS >= endDateInMS) {
    return {
      success: false,
      message: "start date must be before the end date",
    };
  }

  if (now > startDateInMS) {
    return {
      success: false,
      message: "booking start date cannot be in the past.",
    };
  }

  const rentalDaysInMS = endDateInMS - startDateInMS;
  const rentalDays = Math.ceil(rentalDaysInMS / MSPerDay);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vehicles = await client.query(
      `
    SELECT * FROM vehicles WHERE id=$1 FOR UPDATE
    `,
      [vehicle_id]
    );

    if (vehicles.rows.length === 0) {
      await client.query("ROLLBACK");
      return { success: false, message: `no vehicle with id :${vehicle_id}` };
    }

    const vehicle = vehicles.rows[0];

    const daily_rent_price = vehicle.daily_rent_price;
    const availability_status = vehicle.availability_status;

    const isVehicleAvailable =
      availability_status === "available" ? true : false;

    if (!isVehicleAvailable) {
      return {
        success: false,
        message: `vehicle with id: ${vehicle_id} is not available`,
      };
    }

    const OverlapBooking = await client.query(
      `
        SELECT id FROM bookings WHERE vehicle_id = $1 AND rent_end_date > $2 AND rent_start_date < $3
        `,
      [vehicle_id, rent_end_date, rent_start_date]
    );

    if (OverlapBooking.rows.length > 0) {
      await client.query("ROLLBACK");
      return {
        success: false,
        message: `vehicle with id: ${vehicle_id} is already booked for part or all of the requested period.`,
      };
    }

    const total_price = rentalDays * daily_rent_price;

    const result = await client.query(
      `
    INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    await client.query(
      `
    UPDATE vehicles SET availability_status=$1, updated_at=NOW() WHERE id=$2
    `,
      ["booked", vehicle_id]
    );

    await client.query("COMMIT");

    const data = result.rows[0];
    data.vehicle = { vehicle_name: vehicle.vehicle_name, daily_rent_price };

    return {
      success: true,
      message: "Booking created successfully",
      data: data,
    };
  } catch (error: any) {
    await client.query("ROLLBACK");

    throw error;
  }
};

export const bookingService = {
  createBooking,
};
