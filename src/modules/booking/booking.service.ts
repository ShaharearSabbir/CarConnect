import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!customer_id || !vehicle_id) {
    return {
      success: false,
      message: "must provide customer id and vehicle id",
    };
  }

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

const getBooking = async (user: JwtPayload) => {
  const { role, id } = user;

  if (role == "admin") {
    const result = await pool.query(`
        SELECT json_agg(
        json_build_object(
            'id', b.id,
            'customer_id', b.customer_id,
            'vehicle_id', b.vehicle_id,
            'rent_start_date', b.rent_start_date,
            'rent_end_date', b.rent_end_date,
            'total_price', b.total_price,
            'status', b.status,
            'customer', json_build_object(
                'name', u.name,
                'email', u.email
            ),
            'vehicle', json_build_object(
                'vehicle_name', v.vehicle_name,
                'registration_number', v.registration_number
            )
        )
        ) as data FROM bookings b JOIN users u ON b.customer_id = u.id JOIN vehicles v ON b.vehicle_id = v.id
        `);

    return result.rows[0].data;
  }

  if (role == "customer") {
    const result = await pool.query(
      `
        SELECT json_agg(
        json_build_object(
            'id', b.id,
            'customer_id', b.customer_id,
            'vehicle_id', b.vehicle_id,
            'rent_start_date', b.rent_start_date,
            'rent_end_date', b.rent_end_date,
            'total_price', b.total_price,
            'status', b.status,
            'vehicle', json_build_object(
                'vehicle_name', v.vehicle_name,
                'registration_number', v.registration_number,
                'type', v.type
            )
        )
        ) as data FROM bookings b JOIN users u ON b.customer_id = u.id JOIN vehicles v ON b.vehicle_id = v.id WHERE b.customer_id=$1
        `,
      [id]
    );

    return result.rows[0].data;
  }
};

const updateBooking = async (id: string, role: string, status: string) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (status === "returned" && role === "admin") {
      const bookingUpdate = await client.query(
        `
            UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *
            `,
        [status, id]
      );

      const booking = bookingUpdate.rows[0];

      const vehicleUpdate = await client.query(
        `
        UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING availability_status
        `,
        ["available", booking.vehicle_id]
      );

      const availability_status = vehicleUpdate.rows[0].availability_status;

      booking.vehicle = { availability_status };

      await client.query("COMMIT");

      return {
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: booking,
      };
    }

    if (status === "cancelled") {
      const bookingUpdate = await client.query(
        `
            UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *
            `,
        [status, id]
      );

      const booking = bookingUpdate.rows[0];

      const vehicleUpdate = await client.query(
        `
        UPDATE vehicles SET availability_status = $1 WHERE id = $2
        `,
        ["available", booking.vehicle_id]
      );

      await client.query("COMMIT");

      return {
        success: true,
        message: "Booking cancelled successfully",
        data: booking,
      };
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};

export const bookingService = {
  createBooking,
  getBooking,
  updateBooking,
};
