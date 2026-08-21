import { describe, it, expect, vi, beforeEach } from "vitest";
import * as eventsService from "../../src/data/eventsService";
import { supabase } from "../../src/data/supabaseClient";

//supabaseClient.js Mock
// supabaseClient.js: 
// export const supabase = createClient(supabaseUrl, subabaseKey) -> supabase muss gemocked werden
vi.mock("../../src/data/supabaseClient", () => ({
  supabase: {
    from: vi.fn(), //genaue Rückgabe können pro Test Case festgelegt werden
  },
}));

// Hilfsfunktion um Ebenene von einem bestimmten Ergebnis zu mocken -> liefert das was am Ende von supabase.from()...select() returned
function mockSupabaseFunctions(result) {
  const single = vi.fn().mockResolvedValue(result); //soll {data,error} zurückgeben (Promise) | mockResolvedValue, weil single() mit await aufgerufen wird
  const eq = vi.fn().mockReturnValue({ single }); //Obj. mit single-Methode
  const select = vi.fn().mockReturnValue({ eq }); // Obj. mit eq-Methode
  supabase.from.mockReturnValue({ select }); //gibt Mock vor, ein Obj. mit select zurückzugeben
  
  return { single, eq, select };
}

//getEventById(eventId) ----------------------------------------------------------------------------------
describe('getEventById', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns EVENT when event id EXISTS", async () => {
    const fakeEvent = { event_id: 1, title: 'SFW Battle' };
    mockSupabaseFunctions({ data: fakeEvent, error: null });

    const result = await eventsService.getEventById(1);

    expect(result).toEqual(fakeEvent);
  });

   it("returns NULL when event id DOESN'T EXIST ", async () => {
    const fakeEvent = { event_id: 2, title: 'SFW Battle' };
    mockSupabaseFunctions({ data: null});

    const result = await eventsService.getEventById(2);

    expect(result).toBeNull;
  });

  it("throws ERROR when event id is NULL", async () => {
    await expect(eventsService.getEventById(null)).rejects.toThrow('Event ID is required.');
  });

  it('throws error when supabase returns an error', async () => {
    mockSupabaseFunctions({ data: null, error: { message: 'Supabase connection failed' } });
    await expect(eventsService.getEventById(1)).rejects.toThrow();
});
});


// createEvent(userId, eventsData) ---------------------------------------------------------------------------------------
function mockSupabaseFuctionsWithInsert(result) {
    const single = vi.fn().mockResolvedValue(result);
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    supabase.from.mockReturnValue({ insert });
    return { insert, select, single };
}

describe(eventsService.createEvent, () => {
    beforeEach(() => {vi.clearAllMocks();});

    it("creates an event when eventData is valid", async () => {
        
        const fakeEventData = {
            title: "Hip Hop Workshop mit Tri An",
            city: "Hamburg",
            date: new Date(),
            time: new Date(), 
            location: "Goldbekhaus",
            image_url: "image_url",
            slug: "hip-hop-workshop-mit-tri-an",
            type: "Workshop"
        };

        const fakeEvent = {
            event_id: 1,
            ...fakeEventData,
            organizer_id: 123
        }

        mockSupabaseFuctionsWithInsert({data: fakeEvent, error: null});

        const result = await eventsService.createEvent(123, fakeEventData);
        expect(result).toEqual(fakeEvent);
    })

    it ('throws error when supabase returns an error', async () => {
        mockSupabaseFuctionsWithInsert({data: null, error: {message: 'insert failed'}});

        expect(eventsService.createEvent(1, {title: 'Event'})).rejects.toThrow(); 
    });

    it('throws error when userID is missing', async () => {
        const fakeEventData = {
            title: "Tri An Workshop",
            city: "Hamburg",
            date: new Date(),
            time: new Date(), 
            location: "Goldbekhaus",
            image_url: "image_url",
            slug: "tri-an-workshop"
        }

        await expect(eventsService.createEvent(null,fakeEventData)).rejects.toThrow("Organizer ID is required.");
    })

    it('throws error when eventData is missing', async () => {
        await expect(eventsService.createEvent(1,null)).rejects.toThrow("Event data is required.");
    })

    it('throws error when title is missing', async () => {
        const fakeEventData = {
            city: "Hamburg",
            date: new Date(),
            time: new Date(), 
            location: "Goldbekhaus",
            image_url: "image_url",
            slug: "tri-an-workshop",
            type: "Workshop"
        }

        await expect(eventsService.createEvent(123, fakeEventData)).rejects.toThrow("Title is required.");
    })

    it('throws error when time is missing', async () => {
        const fakeEventData = {
            title: "Tri An Workshop",
            city: "Hamburg",
            date: new Date(),
            location: "Goldbekhaus",
            image_url: "image_url",
            slug: "tri-an-workshop",
            type: "Workshop"
        }

        await expect(eventsService.createEvent(123, fakeEventData)).rejects.toThrow("Time is required.");
    })

    it('throws error when date is missing', async () => {
        const fakeEventData = {
            title: "Tri An Workshop",
            city: "Hamburg",
            time: new Date(), 
            location: "Goldbekhaus",
            image_url: "image_url",
            slug: "tri-an-workshop",
            type: "Workshop"
        }

        await expect(eventsService.createEvent(123, fakeEventData)).rejects.toThrow("Date is required.");
    })

     it('throws error when city is missing', async () => {
        const fakeEventData = {
            title: "Tri An Workshop",
            date: new Date(),
            time: new Date(), 
            location: "Goldbekhaus",
            image_url: "image_url",
            slug: "tri-an-workshop",
            type: "Workshop"
        }

        await expect(eventsService.createEvent(123,fakeEventData)).rejects.toThrow("City is required.");
    })
});


/* updateEvent(eventId, newData) ---------------------------------------------------------------------------------------*/

/* filterEvents({ city, type }) ---------------------------------------------------------------------------------------*/
function mockSupabaseFuctionsWithDoubleEq(result) {
    const secondEq = vi.fn().mockResolvedValue(result); //.eq('type', type) → Ergebnis
    const firstEq = vi.fn().mockReturnValue({ eq: secondEq }); // .eq('city', city) → Objekt mit eq
    const select = vi.fn().mockReturnValue({ eq: firstEq });
    supabase.from.mockReturnValue({ select });
    return { select, eq: firstEq, secondEq};
}

describe('filterEvents', () => {

    it('returns EVENTS that FILL the filter criteria', async () => {
        const firstEventObject = {
            organizer_id: 1,
            title: "Tri An Workshop",
            date: new Date(),
            time: new Date(), 
            city: "Hamburg",
            location: "Goldbekhaus",
            image_url: "image_url",
            slug: "tri-an-workshop",
            type: "Workshop"
        }

        const secondEventObject = {
            organizer_id: 1,
            title: "Andinia Workshop",
            date: new Date(),
            time: new Date(), 
            city: "Hamburg",
            location: "Goldbekhaus",
            image_url: "image_url",
            slug: "andinia-workshop",
            type: "Workshop"
        }
        mockSupabaseFuctionsWithDoubleEq({data: [firstEventObject, secondEventObject], error: null});
        const result = await eventsService.filterEvents({city: "Hamburg", type: "Workshop"});

         expect(result).toEqual([firstEventObject,secondEventObject]);
    });

    it('throws ERROR when there are NO EVENTS that fit filter criteria', async () => {

        mockSupabaseFuctionsWithDoubleEq({data: null, error: null});
        await expect(eventsService.filterEvents({city: "Munich", type: "Battle"})).rejects.toThrow("No events found.");

    });



})

/* createSlug() ---------------------------------------------------------------------------------------*/

describe('eventsService.createSlug', () => {
    it ('creates a slug when NORMAL input', () => {
        const result = eventsService.createSlug('Sorry For What Battle')
        expect(result).toBe('sorry-for-what-battle')
    })

    it('creates a slug with NUMBERS when input hast numbers', () => {
        const result = eventsService.createSlug('Back 2 The Basics Battle')
        expect(result).toBe('back-2-the-basics-battle')
    })

    it('removes SPECIAL CHARACTERS from slug when input has special characters', () => {
        const result = eventsService.createSlug('crazy🎉 Battle NamE $")§')
        expect(result).toBe('crazy-battle-name')
        
    })
 
   it('transforms UMLAUTS when input has umlauts', () => {
        const result = eventsService.createSlug('Überdimensionales Event 2026')
        expect(result).toBe('ueberdimensionales-event-2026')
        
    })
    
    //ERRORS
    it('returns ERROR when input is NULL', () => {
        expect(() => createSlug(null).toThrow('Title is required.'))
    });

    it('returns ERROR when input is EMPTY STRING', () => {
        expect(() => createSlug("").toThrow("Title cannot be empty or whitespaces only"))
    });

     it('returns ERROR when input consists of only WHITE SPACES', () => {
       expect(() => createSlug("").toThrow("Title cannot be empty or whitespace only"))
    });
})

//getEventBySlug() ---------------------------------------------------------------------------------------