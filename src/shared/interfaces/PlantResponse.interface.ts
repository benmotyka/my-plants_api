import { Watering } from ".prisma/client";

export interface PlantResponse {
    id: string;
    name: string;
    description?: string;
    imgSrc?: string;
    createdAt: Date;

    latestWatering?: Watering
}