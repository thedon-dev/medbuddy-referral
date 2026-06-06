import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { createClient } = await import("@supabase/supabase-js");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const body = await request.json();

    const { data, error } = await supabase.functions.invoke(
      "send-referral-email",
      {
        body: {
          userName: body.userName,
          userEmail: body.userEmail,
          referredUserName: body.referredUserName,
          courseName: body.courseName,
          currency: body.currency,
          referralAmount: body.referralAmount,
        },
      },
    );

    if (error) {
      console.error("Function error:", error);
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data.message || "Email sent successfully",
        data: data.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
