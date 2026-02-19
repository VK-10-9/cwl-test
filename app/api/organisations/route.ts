import { NextRequest, NextResponse } from "next/server";
import {
    getOrganisations,
    createOrganisation,
    getOrganisationById,
    updateOrganisation,
    deleteOrganisation,
} from "@/lib/db";
import { organisationSchema } from "@/types";

// GET /api/organisations?q=search
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q") || "";
        const id = searchParams.get("id");

        if (id) {
            const org = getOrganisationById(id);
            if (!org) {
                return NextResponse.json(
                    { error: "Organisation not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json(org);
        }

        const organisations = getOrganisations(query || undefined);
        return NextResponse.json(organisations);
    } catch (error) {
        console.error("Error fetching organisations:", error);
        return NextResponse.json(
            { error: "Failed to fetch organisations" },
            { status: 500 }
        );
    }
}

// POST /api/organisations
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate with Zod
        const result = organisationSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid data", details: result.error.format() },
                { status: 400 }
            );
        }

        const newOrg = createOrganisation(result.data);
        return NextResponse.json(newOrg, { status: 201 });
    } catch (error) {
        console.error("Error creating organisation:", error);
        return NextResponse.json(
            { error: "Failed to create organisation" },
            { status: 500 }
        );
    }
}

// PUT /api/organisations?id=xxx
export async function PUT(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const updated = updateOrganisation(id, body);

        if (!updated) {
            return NextResponse.json(
                { error: "Organisation not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating organisation:", error);
        return NextResponse.json(
            { error: "Failed to update organisation" },
            { status: 500 }
        );
    }
}

// DELETE /api/organisations?id=xxx
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        const deleted = deleteOrganisation(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Organisation not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting organisation:", error);
        return NextResponse.json(
            { error: "Failed to delete organisation" },
            { status: 500 }
        );
    }
}
