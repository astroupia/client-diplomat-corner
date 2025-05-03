"use server";

import { connectToDatabase } from "@/lib/db-connect";
import Car, { ICar } from "@/lib/models/car.model";

// 1. CreateCar(carDetails: object) – Add a new car entity to the system
export async function createCar(carDetails: Partial<ICar>) {
  await connectToDatabase();

  const car = new Car({
    ...carDetails,
    Timestamp: new Date().toISOString(),
  });

  try {
    await car.save();
    return { success: true, id: car._id.toString() };
  } catch (error) {
    throw new Error(`Failed to create car: ${(error as Error).message}`);
  }
}

// 2. DeleteCar(carId: string) – Remove an existing car from the system
export async function deleteCar(carId: string) {
  await connectToDatabase();

  try {
    const result = await Car.deleteOne({ _id: carId });
    if (result.deletedCount === 0) {
      throw new Error("Car not found");
    }
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete car: ${(error as Error).message}`);
  }
}

// 3. UpdateCarDetails(carId: string, updates: object) – Update metadata about the car
export async function updateCarDetails(carId: string, updates: Partial<ICar>) {
  await connectToDatabase();

  try {
    const car = await Car.findByIdAndUpdate(carId, updates, { new: true });
    if (!car) {
      throw new Error("Car not found");
    }
    return { success: true, car };
  } catch (error) {
    throw new Error(`Failed to update car: ${(error as Error).message}`);
  }
}

// 4. getCarDetails(carId: string) – Retrieve and display car information
export async function getCarDetails(carId: string) {
  await connectToDatabase();

  try {
    const car = await Car.findById(carId);
    if (!car) {
      throw new Error("Car not found");
    }
    return { success: true, car: car.toObject() };
  } catch (error) {
    throw new Error(`Failed to get car details: ${(error as Error).message}`);
  }
}

export async function getAllCars(): Promise<ICar[]> {
  try {
    await connectToDatabase();

    const cars = await Car.find({});
    console.log("Fetched cars:", cars);

    return cars;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw new Error(`Failed to fetch cars: ${(error as Error).message}`);
  }
}

export async function getCarById(id: string) {
  try {
    await connectToDatabase();
    const car = await Car.findById(id);
    return car;
  } catch (error) {
    console.error("Error fetching car:", error);
    throw error;
  }
}