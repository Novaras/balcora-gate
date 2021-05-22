// Declarations for Weapons

export const WeaponTypes = [`gimble`, `animatedturret`, `fixed`] as const;
export type WeaponType = typeof WeaponTypes[number];
export const ProjectileTypes = <const>[`instanthit`, `bullet`, `mine`, `missile`, `sphereburst`];
export type ProjectileType = typeof ProjectileTypes[number];
export const ActivationContexts = <const>[`normal`, `special attack`, `normal only`, `dropped`];
export type ActivationContext = typeof ActivationContexts[number];
export const ShieldPenetrationModes = <const>[`normal`, `enhanced`,  `bypass`];
export type ShieldPenetrationMode = typeof ShieldPenetrationModes[number];

declare interface Weapon {
	name: string,
	display_name: string,
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

declare interface AttackFamilyExceptions {
	fighter: number,
	fighter_hw1: number,
	corvette: number,
	corvette_hw1: number,
	frigate: number,
	utility: number,
	muniton: number,
	smallcapitalship: number,
	bigcapitalship: number,
	mothership: number,
	emplacement: number,
	unattackable: number,
	subsystem: number,
	resourcelarge: number,
	capturer: number,
	chimera: number,
	nonsensefamily: number,
	noncombat: number,
	swarmer: number,
	spacemine: number,
	torpedo: number,
	heavymissile: number,
	smallmissile: number,
}

declare interface ArmourFamilyExceptions {
	unarmoured: number,
	unarmoured_hw1: number,
	lightarmour: number,
	lightarmour_hw1: number,
	mediumarmour: number,
	mediumarmour_hw1: number,
	heavyarmour: number,
	subsystemarmour: number,
	turretarmour: number,
	resarmour: number,
	moverarmour: number,
	planetkillerarmour: number,
	minearmour: number,
	chunkarmour: number,
	resourcearmour: number,
	gravitywellarmour: number,
	swarmerarmour: number,
	spaceminearmour: number,
	torpedoarmour: number,
	heavymissilearmour: number,
	smallmissilearmour: number,
	probearmour: number
}

declare interface MagneticFieldExceptions {
	MagneticField: number,
}

// todo: needs a mention that there is no fields for `setDamageMultFactor`, since I have 0 clue what it does if anything
// same for `setFireMultFactor`
// same for `setRangeBoost`
declare interface SpeedVsAccuracy {
	speed: number,
	accuracy: number
}

export declare interface WeaponExt extends Weapon {
	turret_sound?: string,
	weapon_result: {
		condition: `hit` | `miss`,
		effect: `damagehealth` | `disable` | `push` | `spawnweaponfire`,
		target: `target` | `owner`,
		effect_min: number,
		effect_max: number,
		spawns_weapon?: string,
	},
	accuracy: {
		default: number,
		family_exceptions?: AttackFamilyExceptions
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
		unknown_0: boolean,
		unknown_1: number,
		unknown_2: number
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
		family_exceptions?: MagneticFieldExceptions
	},
	misc_values?: {
		barrel_recoil_distance: number,
		slave_fire_delay: number
	},
	missile_killer?: boolean,
	miss_properties?: {
		cone_x: number,
		cone_y: number,
		damage_mult_low: number,
		damage_mult_high: number,
		projectile_speed_mult: number,
		projectile_lifetime_mult: number
	},
	penetration: {
		default: number,
		family_exceptions?: ArmourFamilyExceptions
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
