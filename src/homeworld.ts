// Declarations for Weapons

export const WeaponTypes = [`gimble`, `animatedturret`, `fixed`] as const;
export type WeaponType = typeof WeaponTypes[number];
export const ProjectileTypes = <const>[`instanthit`, `bullet`, `mine`, `missile`, `sphereburst`];
export type ProjectileType = typeof ProjectileTypes[number];
export const ActivationContexts = <const>[`normal`, `special attack`, `normal only`, `dropped`];
export type ActivationContext = typeof ActivationContexts[number];
export const ShieldPenetrationModes = <const>[`normal`, `enhanced`,  `bypass`];
export type ShieldPenetrationMode = typeof ShieldPenetrationModes[number];

export interface Weapon {
	weapon_type: WeaponType,
	projectile_type: ProjectileType,
	fire_script: string,
	activation_context: ActivationContext,
	projectile_speed: number,
	range: number,
	sphereburst_radius: number,
	beam_duration: number,
	beam_anticipation_time: number,
	missile_fire_axis: 0 | 1 | 2,
	max_effects: number,
	use_velocity_prediction: boolean,
	check_line_of_fire: boolean,
	shot_interval: number,
	burst_duration: number,
	burst_interval: number,
	shoot_at_secondaries: boolean,
	shoot_at_surroundings: boolean,
	tracking_speed_x: number,
	tracking_speed_y: number,
	speed_mult_when_over_target: number,
	shield_penetration_mode: ShieldPenetrationMode,
	track_outside_range: boolean,
	wait_for_codered: boolean,
	beam_penetration_threshold: number,
}

export const AttackFamilies = [
	`fighter`,
	`fighter_hw1`,
	`corvette`,
	`corvette_hw1`,
	`frigate`,
	`utility`,
	`munition`,
	`smallcapitalship`,
	`bigcapitalship`,
	`mothership`,
	`emplacement`,
	`unattackable`,
	`subsystem`,
	`resourcelarge`,
	`capturer`,
	`nonsensefamily`,
	`noncombat`,
	`swarmer`,
	`spacemine`,
	`torpedo`,
	`heavymissile`,
	`smallmissile`
] as const;

export type AttackFamilyExceptions = {
	[k in typeof AttackFamilies[number]]?: number
};

export const ArmourFamilies = [
	`unarmored`,
	`unarmoured_hw1`,
	`lightarmour`,
	`lightarmour_hw1`,
	`mediumarmour`,
	`heavyarmour`,
	`subsystemarmour`,
	`turretarmour`,
	`resarmour`,
	`moverarmour`,
	`planetkillerarmour`,
	`minearmour`,
	`chunkarmour`,
	`resourcearmour`,
	`gravitywellarmour`,
	`swarmerarmour`,
	`spaceminearmour`,
	`torpedoarmour`,
	`heavymissilearmour`,
	`smallmissilearmour`,
	`probearmour`
] as const;

export type ArmourFamilyExceptions = {
	[k in typeof ArmourFamilies[number]]?: number
}

export const MagneticFieldFamilies = [`magneticfield`] as const;
export type MagneticFieldFamilyExceptions = {
	[k in typeof MagneticFieldFamilies[number]]?: number
}

// todo: needs a mention that there is no fields for `setDamageMultFactor`, since I have 0 clue what it does if anything
// same for `setFireMultFactor`
// same for `setRangeBoost`
export interface SpeedVsAccuracy {
	speed: number,
	accuracy: number
}

export const ResultEffects = [`damagehealth`, `disable`, `push`, `spawnweaponfire`] as const;
export const ResultConditions = [`hit`, `miss`] as const;
export const ResultTargets = [`target`, `owner`] as const; 

export interface WeaponExt extends Weapon {
	name?: string,
	turret_sound?: string,
	weapon_result: {
		condition: typeof ResultConditions[number],
		effect: typeof ResultEffects[number],
		target: typeof ResultTargets[number],
		effect_min: number,
		effect_max: number,
		spawns_weapon: string,
	},
	accuracy: {
		default: number,
		exceptions?: AttackFamilyExceptions
	},
	accuracy_falloff?: {
		falloff_over_range: number,
		percentage_start: number,
	},
	fire_angles: {
		cone_radius: number,
		rotate_x_min: number,
		rotate_x_max: number,
		rotate_y_min: number,
		rotate_y_max: number,
	},
	ballistics?: {
		disabled: boolean,
		lead_amount: number
	},
	damage_falloff?: {
		falloff_over_range: number,
		percentage_start: number,
	},
	frustrated_timers?: {
		min: number,
		max: number
	},
	lifetime_mult?: number,
	magnetic_field_pen?: {
		default: number,
		exceptions?: MagneticFieldFamilyExceptions
	},
	misc_values?: {
		barrel_recoil_distance: number,
		slave_fire_delay: number
	},
	missile_killer?: boolean,
	miss_properties?: {
		cone_x_max: number,
		cone_y_max: number,
		damage_mult_low: number,
		damage_mult_high: number,
		projectile_speed_mult: number,
		projectile_lifetime_mult: number
	},
	penetration: {
		default: number,
		field_pen: number,
		exceptions?: ArmourFamilyExceptions
	},
	range_boost?: number,
	stance_ranges?: {
		evasive: number,
		neutral: number,
		aggresive: number,
	},
	speed_accuracy_modifier?: {
		use_as_target_prio_source: boolean,
		mults?: [
			SpeedVsAccuracy,
			SpeedVsAccuracy?,
			SpeedVsAccuracy?,
			SpeedVsAccuracy?,
			SpeedVsAccuracy?,
			SpeedVsAccuracy?
		],
	}
}

export type AnyEnumerable = (typeof WeaponTypes | typeof ProjectileTypes | typeof ShieldPenetrationModes | typeof ActivationContexts | typeof AttackFamilies | typeof ArmourFamilies);
