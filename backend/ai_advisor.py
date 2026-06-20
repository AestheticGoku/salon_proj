def generate_prescription(name: str, goal: str, skin_type: str, duration: str) -> dict:
    services = []
    products = []
    
    # 1. Customizing the introductory description and ingredients based on skin profile
    ingredient_advice = ""
    if skin_type == "dry":
        ingredient_advice = "Your dry skin profile benefits from deep nourishment. Saffron (Kesar) and milk infusions will penetrate deep epidermal layers to revive moisture, combined with cold-pressed sweet almond oils."
    elif skin_type == "sensitive":
        ingredient_advice = "For your delicate skin type, we prioritize calming cooling agents. Saffron and pure Vetiver (Khus) will soothe redness, while rose-quartz gua sha sculpting ensures zero irritation."
    else: # active/oily
        ingredient_advice = "To balance sebum production, we suggest astringent Ayurvedic formulations. Multani mitti (Fullers earth), neem, and wild turmeric will purify pores, backed by herbal steam therapy."

    duration_advice = ""
    if duration == "day":
        duration_advice = "As you are on a tight schedule, we have packed these treatments into a single-day, high-impact immersion session."
    elif duration == "week":
        duration_advice = "Over your multi-day stay in Udaipur, we recommend spacing these rituals across two sessions to let the Ayurvedic elixirs absorb fully."
    else: # resident
        duration_advice = "As an Udaipur resident, we advise enrolling in our monthly Pichola Club membership to receive these treatments on a regular 21-day cycle."

    # 2. Selecting services and products based on Goal
    if goal == "bridal":
        description = (
            f"Greetings {name}. Your wedding calls for ultimate luminosity. {ingredient_advice} "
            f"We have structured an elite sequence of gold leaf infusions and skin-polishing saffron elixirs to prepare you. {duration_advice}"
        )
        services = [
            {"id": "facial", "name": "Luminosity Facials", "price": 6800, "details": "24K gold infusions & saffron brightening"},
            {"id": "bridal", "name": "Elite Bridal Grooming (Pichola Bride)", "price": 45000, "details": "30-day pre-wedding skin preparation & day-of artistry"}
        ]
        products = [
            {"id": "serum", "brand": "Kesar Naturals", "name": "Saffron & Rose Luminance Serum", "price": 3200, "img": "/images/saffron_serum.png"},
            {"id": "gold", "brand": "Royal Glow", "name": "24K Gold Facial Dust", "price": 5500, "img": "/images/gold_dust.png"}
        ]
    elif goal == "detox":
        description = (
            f"Welcome, {name}. To dissolve physical stress and ground your energy, we recommend warm herbal oil flows and Shirodhara. "
            f"{ingredient_advice} {duration_advice}"
        )
        services = [
            {"id": "spa", "name": "Royal Spa Retreats", "price": 8500, "details": "Ancient Panchakarma & warm kesar-milk body wraps"},
            {"id": "wellness", "name": "Wellness Alchemy", "price": 5500, "details": "Shirodhara warm oil therapy & dosha consult"}
        ]
        products = [
            {"id": "oil", "brand": "Udaipur Attar", "name": "Jasmine & Vetiver Ritual Oil", "price": 1800, "img": "/images/ritual_oil.png"},
            {"id": "scrub", "brand": "Aravalli Herbs", "name": "Sandalwood Ubtan Body Scrub", "price": 1200, "img": "/images/body_scrub.png"}
        ]
    elif goal == "grooming":
        description = (
            f"Greetings, {name}. We have designed a grooming sequence tailored for active restoration and scalp strength. "
            f"{ingredient_advice} {duration_advice}"
        )
        services = [
            {"id": "salon", "name": "Heritage Salon Ritual", "price": 3200, "details": "Traditional Rajput head oiling & beard architecture"},
            {"id": "facial", "name": "Luminosity Facials", "price": 6800, "details": "Deep pore cleanse & Rose quartz face lift"}
        ]
        products = [
            {"id": "scrub", "brand": "Aravalli Herbs", "name": "Sandalwood Ubtan Body Scrub", "price": 1200, "img": "/images/body_scrub.png"}
        ]
    else: # pamper / escape
        description = (
            f"Hello, {name}. A refreshing escape curated to revive skin brightness and relax the hands and feet. "
            f"{ingredient_advice} {duration_advice}"
        )
        services = [
            {"id": "facial", "name": "Luminosity Facials", "price": 6800, "details": "Saffron skin-polishing facial"},
            {"id": "nail", "name": "Haute Nail Atelier", "price": 2400, "details": "Botanical soak & hand mask"}
        ]
        products = [
            {"id": "serum", "brand": "Kesar Naturals", "name": "Saffron & Rose Luminance Serum", "price": 3200, "img": "/images/saffron_serum.png"}
        ]

    return {
        "description": description,
        "services": services,
        "products": products
    }
