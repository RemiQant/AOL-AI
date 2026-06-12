import re

KNIFE_WEAPONS = {
    "karambit", "butterfly knife", "m9 bayonet", "bayonet", "flip knife",
    "gut knife", "navaja knife", "shadow daggers", "falchion knife",
    "bowie knife", "huntsman knife", "stiletto knife", "talon knife",
    "ursus knife", "skeleton knife", "nomad knife", "paracord knife",
    "survival knife",
}
PISTOL_WEAPONS = {
    "desert eagle", "usp-s", "glock-18", "p250", "five-sevens", "tec-9",
    "cz75-auto", "dual berettas", "r8 revolver", "p2000",
}


def parse_hash_name(hash_name: str) -> dict:
    """Parse 'AK-47 | Redline (Field-Tested)' into weapon/name/wear/category."""
    wear_match = re.search(r"\(([^)]+)\)$", hash_name)
    wear = wear_match.group(1) if wear_match else ""
    name_no_wear = hash_name.replace(f" ({wear})", "").strip() if wear else hash_name

    if " | " in name_no_wear:
        weapon = name_no_wear.split(" | ", 1)[0].strip()
        name = name_no_wear
    else:
        weapon = name_no_wear
        name = name_no_wear

    weapon_lower = weapon.lower()
    if any(k in weapon_lower for k in KNIFE_WEAPONS):
        category = "knife"
    elif any(p in weapon_lower for p in PISTOL_WEAPONS):
        category = "pistol"
    else:
        category = "rifle"

    return {"weapon": weapon, "name": name, "wear": wear, "category": category}
