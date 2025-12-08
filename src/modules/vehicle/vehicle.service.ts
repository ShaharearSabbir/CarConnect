import { pool } from "../../config/db";

const addVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
        INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getVehicle = async () => {
  const result = await pool.query(`
    SELECT * FROM vehicles
    `);

  return result;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM vehicles WHERE id=$1
    `,
    [id]
  );

  return result;
};

const updateVehicle = async (id: string, payload: Record<string, unknown>) => {
  const updates: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const validKeys = [
    "vehicle_name",
    "type",
    "registration_number",
    "daily_rent_price",
    "availability_status",
  ];

  for (const key of validKeys) {
    if (payload[key] !== undefined) {
      updates.push(`${key}=$${paramIndex}`);

      params.push(payload[key]);

      paramIndex++;
    }
  }

  if (updates.length === 0) {
    return { success: false, message: "no field provided for update" };
  }

  updates.push(`updated_at=NOW()`);

  const setForUpdate = updates.join(", ");

  params.push(id);

  const result = await pool.query(
    `
    UPDATE vehicles SET ${setForUpdate} WHERE id=$${paramIndex} RETURNING *
    `,
    params
  );

  if (result.rows.length === 0) {
    return { success: false, message: `no vehicle with id: ${id}` };
  }

  return {
    success: true,
    message: "Vehicle updated successfully",
    data: result.rows[0],
  };
};

const deleteVehicle = async (id: string) => {
  const isActiveBooking = await pool.query(
    `
    SELECT status FROM bookings WHERE vehicle_id = $1 AND status = $2 
    `,
    [id, "active"]
  );

  if (isActiveBooking.rows.length !== 0) {
    return { success: false, message: "this vehicle has active booking" };
  }

  const result = await pool.query(
    `
    DELETE vehicles WHERE id=$1
    `,
    [id]
  );

  if (result.rowCount === 1) {
    return { success: true, message: "Vehicle deleted successfully" };
  }

  return { success: false, message: `no vehicle with id: ${id}` };
};

export const vehicleService = {
  addVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
