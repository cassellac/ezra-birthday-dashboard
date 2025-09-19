import { NextResponse } from 'next/server';

export async function GET() {
  const spots = [
    {
      name: "Holston River Park",
      location: "Knoxville, TN",
      fish: ["Bass", "Catfish", "Crappie"],
      description: "Great spot with easy access and plenty of fish",
      coordinates: { lat: 35.9606, lng: -83.9207 }
    },
    {
      name: "Volunteer Landing Park",
      location: "Knoxville, TN", 
      fish: ["Bluegill", "Bass", "Catfish"],
      description: "Family-friendly with picnic areas",
      coordinates: { lat: 35.9634, lng: -83.9180 }
    },
    {
      name: "Concord Park",
      location: "Farragut, TN",
      fish: ["Trout", "Bass", "Sunfish"],
      description: "Beautiful lakeside fishing with trails",
      coordinates: { lat: 35.8845, lng: -84.1513 }
    },
    {
      name: "Fort Loudoun Lake",
      location: "Lenoir City, TN",
      fish: ["Striped Bass", "Crappie", "Walleye"],
      description: "Large lake with boat ramps available",
      coordinates: { lat: 35.7956, lng: -84.2503 }
    }
  ];
  
  return NextResponse.json({ spots });
}
