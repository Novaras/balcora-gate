import { ArmourFamilies, AttackFamilies, WeaponExt } from '$src/homeworld';

type PartWeapon = Partial<WeaponExt>;

type PartWeaponKeys = keyof PartWeapon;
type PartWeaponVals = PartWeapon[PartWeaponKeys];

export const objToWeaponLua = (obj: PartWeapon): string => {

	const parseJsVal = (js_val: PartWeaponVals) => {
		if (typeof js_val === `boolean`) return js_val === true ? 1 : 0;
		else if (typeof js_val === `string`) return `"${js_val}"`;
		else return js_val;
	};

	const str_parts = [
		`-- Generated with https://www.balcora-gate.com/tools/weapon-editor (by Fear)`
	];

	// StartWeaponConfig:
	const config_keys = [
		`weapon_type`,
		`projectile_type`,
		`fire_script`,
		`activation_context`,
		`projectile_speed`,
		`range`,
		`sphereburst_radius`,
		`beam_duration`,
		`beam_anticipation_time`,
		`missile_fire_axis`,
		`max_effects`,
		`use_velocity_prediction`,
		`check_line_of_fire`,
		`shot_interval`,
		`burst_duration`,
		`burst_interval`,
		`shoot_at_secondaries`,
		`shoot_at_surroundings`,
		`tracking_speed_x`,
		`tracking_speed_y`,
		`speed_mult_when_over_target`,
		`shield_penetration_mode`,
		`track_outside_range`,
		`wait_for_codered`,
		`beam_penetration_threshold`
	];
	str_parts.push(
		`StartWeaponConfig(NewWeaponType, ${
			config_keys.reduce((acc, c_key) => `${acc.length ? `${acc}, ` : ``}${parseJsVal(obj[c_key])}`, ``)
		});`
	);

	// AddWeaponResult:
	str_parts.push(
		`AddWeaponResult(NewWeaponType, ${
			Object.keys(obj.weapon_result).reduce((acc, r_key) => `${acc.length ? `${acc}, ` : ``}${parseJsVal(obj[`weapon_result`][r_key])}`, ``)
		});`
	);

	// setPenetration:
	str_parts.push(
		`setPenetration(NewWeaponType, ${obj.penetration.default}, ${obj.penetration.field_pen}${obj.penetration.exceptions ? 
			ArmourFamilies.reduce((acc, p_key) => {
				const family_val = obj.penetration.exceptions[p_key];
				return family_val ? `${acc.length ? `${acc}, ` : `, `}{${p_key} = ${family_val}}` : acc;
			}, ``)
		: ``});`
	);

	// setAccuracy:
	str_parts.push(
		`setAccuracy(NewWeaponType, ${obj.accuracy.default}${obj.accuracy.exceptions ?
			AttackFamilies.reduce((acc, a_key) => {
				const family_val = obj.accuracy.exceptions[a_key];
				return family_val ? `${acc.length ? `${acc}, ` : `, `}{${a_key} = ${family_val}}` : acc;
			}, ``)
		: ``});`
	);

	// setAngles:
	str_parts.push(`setAngles(NewWeaponType, ${
		Object.keys(obj.fire_angles).reduce((acc, fa_key) => `${acc.length ? `${acc}, ` : ``}${obj.fire_angles[fa_key]}`, ``)
	});`);

	// setBallistics:
	if (obj.ballistics) {
		str_parts.push(`setBallistics(NewWeaponType, ${obj.ballistics.disabled}, ${obj.ballistics.lead_amount});`);
	}

	// setAccuracyFalloff:
	if (obj.accuracy_falloff) {
		str_parts.push(`setAccuracyFalloff(NewWeaponType, ${obj.accuracy_falloff.falloff_over_range}, ${obj.accuracy_falloff.percentage_start});`);
	}

	// setDamageFalloff:
	if (obj.damage_falloff) {
		str_parts.push(`setDamageFalloff(NewWeaponType, ${obj.damage_falloff.falloff_over_range}, ${obj.damage_falloff.percentage_start});`);
	}

	// setFrustratedTimers:
	if (obj.frustrated_timers) {
		str_parts.push(`setFrustratedTimers(NewWeaponType, ${obj.frustrated_timers.min}, ${obj.frustrated_timers.max});`);
	}

	// setLifetimeMult:
	if (obj.lifetime_mult) {
		str_parts.push(`setLifetimeMult(NewWeaponType, ${obj.lifetime_mult});`);
	}

	// setMagneticFieldPenetration:
	if (obj.magnetic_field_pen) {
		str_parts.push(`setMagneticFieldPenetration(NewWeaponType, ${obj.magnetic_field_pen.default}${obj.magnetic_field_pen.exceptions ?
			Object.keys(obj.magnetic_field_pen.exceptions).reduce((acc, mf_key) => {
				const family_val = obj.magnetic_field_pen.exceptions[mf_key];
				return family_val ? `${acc.length ? `${acc}, ` : `, `}{${mf_key} = ${family_val}}` : acc;
			}, ``)
		: ``});`);
	}

	// setMiscValues:
	if (obj.misc_values) {
		str_parts.push(`setMiscValues(NewWeaponType, ${obj.misc_values.barrel_recoil_distance}, ${obj.misc_values.slave_fire_delay});`);
	}

	// setMissProperties:
	if (obj.miss_properties) {
		str_parts.push(`setMissProperties(NewWeaponType, ${
			Object.keys(obj.miss_properties).reduce((acc, prop_key) => `${acc.length ? `${acc}, `: ``}${obj.miss_properties[prop_key]}`, ``)
		});`);
	}

	if (obj.range_boost) {
		str_parts.push(`setRangeBoost(NewWeaponType, ${obj.range_boost});`);
	}

	// return Object.entries(obj).reduce((acc, [k, v]: [PartWeaponKeys, PartWeaponVals]) => {
	// 	const mapFn = (k: PartWeaponKeys, v: PartWeaponVals): string => {
	// 		switch (k) {
	// 			case `weapon_type`:
	// 				return 
	// 		}
	// 	};
	// 	return `${acc}\n${mapFn(k, v)}`;
	// }, ``);

	return str_parts.reduce((acc, part) => `${acc}\n${part}`, ``);
};