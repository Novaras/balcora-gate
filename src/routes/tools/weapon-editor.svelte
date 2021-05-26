<script lang="ts">
	import { Tab, Tabs, TabList, TabPanel } from 'svelte-tabs';

	import FloatLabelTextInput from '$components/FloatLabelTextInput.svelte';
	import SelectInput from '$components/SelectInput.svelte';
	import FormGroup from '$components/FormGroup.svelte';

	import type {
		ArmourFamilyExceptions,
		AttackFamilyExceptions,
		MagneticFieldFamilyExceptions,
		WeaponExt
	} from '$src/homeworld';
	import {
		AttackFamilies,
		ArmourFamilies,
		WeaponTypes,
		ProjectileTypes,
		ActivationContexts,
		ShieldPenetrationModes,
		ResultConditions,
		ResultEffects,
		ResultTargets,
		MagneticFieldFamilies
	} from '$src/homeworld';

	// no impl for damage_falloff, frustrated_timers, stance_ranges, speed_accuracy_modifier
	let the_weapon: Partial<WeaponExt> = {
		weapon_type: `gimble`,
		projectile_type: `bullet`,
		fire_script: `bullet`,
		activation_context: `normal only`,
		projectile_speed: 1000,
		range: 2000,
		sphereburst_radius: 0,
		beam_duration: 0,
		beam_anticipation_time: 0,
		missile_fire_axis: 0,
		max_effects: 1,
		use_velocity_prediction: true,
		check_line_of_fire: true,
		burst_duration: 1,
		burst_interval: 1,
		shot_interval: 0.1,
		shoot_at_secondaries: true,
		shoot_at_surroundings: false,
		tracking_speed_x: 0,
		tracking_speed_y: 0,
		speed_mult_when_over_target: 1,
		shield_penetration_mode: `normal`,
		track_outside_range: true,
		wait_for_codered: true,
		beam_penetration_threshold: 0,
		accuracy: {
			default: 1
		},
		penetration: {
			default: 1
		},
		weapon_result: {
			condition: `hit`,
			effect: `damagehealth`,
			target: `target`,
			effect_min: 0,
			effect_max: 1
		},
		fire_angles: {
			cone_radius: 45,
			rotate_x_min: -90,
			rotate_x_max: 90,
			rotate_y_min: -5,
			rotate_y_max: 90,
		}
	};

	const makeSelectInputOpts = (source_arr): SelectOpt<string>[] => {
		return source_arr.map((thing: string, index: number) => ({
			display: thing,
			value: thing,
			id: index,
		}));
	};

	const bool_types = [
		{
			display: `True`,
			value: true,
			parse: (v: string) => v === `true`,
			id: 0
		},
		{
			display: `False`,
			value: false,
			parse: (v: string) => v !== `false`,
			id: 1
		}
	];
	
	const weapon_types = makeSelectInputOpts(WeaponTypes);

	const projectile_types = makeSelectInputOpts(ProjectileTypes);

	const activation_contexts = makeSelectInputOpts(ActivationContexts);

	const shield_pen_modes = makeSelectInputOpts(ShieldPenetrationModes);

	const result_conditions = makeSelectInputOpts(ResultConditions);
	const result_effects = makeSelectInputOpts(ResultEffects);
	const result_targets = makeSelectInputOpts(ResultTargets);

	let hide_invalid = false;
	// probably better to have an obj with keys i can iterate or reference via strings, todo?
	let show_accuracy_falloffs = false;
	let show_ballistics = false;
	let show_mag_pen = false;
	let show_misc_vals = false;
	let show_miss_props = false;
	
	type FamilyExceptionSelectEv<T> = CustomEvent<SelectOpt<keyof T>>;


	// family exceptions
	// again, not very DRY

	const filterOverridden = (family_list, current_overrides) => family_list.filter(family => !Object.keys(current_overrides).includes(family));

	let accuracy_overrides: AttackFamilyExceptions = {};
	const addAccuracyOverride = (ev: FamilyExceptionSelectEv<AttackFamilyExceptions>) => {
		if (the_weapon.accuracy.exceptions == null) {
			the_weapon.accuracy.exceptions = {};
		}
		accuracy_overrides[ev.detail.value] = null;
	}
	$: accuracy_override_keys = Object.keys(accuracy_overrides);
	$: unassigned_accuracy_overrides = makeSelectInputOpts(filterOverridden(AttackFamilies, accuracy_overrides));

	let penetration_overrides: ArmourFamilyExceptions = {};
	const addPenetrationOverride = (ev: FamilyExceptionSelectEv<ArmourFamilyExceptions>) => {
		if (the_weapon.penetration.exceptions == null) {
			the_weapon.penetration.exceptions = {};
		}
		penetration_overrides[ev.detail.value] = null;
	};
	$: penetration_override_keys = Object.keys(penetration_overrides);
	$: unassigned_penetration_overrides = makeSelectInputOpts(filterOverridden(ArmourFamilies, penetration_overrides));

	let mag_pen_overrides: MagneticFieldFamilyExceptions = {};
	const addMagneticFieldOverride = (ev: FamilyExceptionSelectEv<MagneticFieldFamilyExceptions>) => {
		if (the_weapon.magnetic_field_pen?.exceptions == null) {
			the_weapon.magnetic_field_pen.exceptions = {};
		}
		mag_pen_overrides[ev.detail.value] = null;
	};
	$: mag_pen_override_keys = Object.keys(mag_pen_overrides);
	$: unassigned_mag_pen_overrides = makeSelectInputOpts(filterOverridden(MagneticFieldFamilies, mag_pen_overrides));

	const validators = {
		requiresProjectileType: (type: typeof ProjectileTypes[number]) => the_weapon.projectile_type !== type ? `Only works if Weapon Type is '${type}'` : ``
	};
	$: validation_warnings = {
		_src: the_weapon, // hack to force updates... real solution would be chaning all the `bind:value`s to event listeners with a hook
		beam_duration: validators.requiresProjectileType(`instanthit`),
		beam_anticipation_time: validators.requiresProjectileType(`instanthit`),
		beam_penetration_threshold: validators.requiresProjectileType(`instanthit`),
		missile_axis: validators.requiresProjectileType(`missile`),
		sphereburst_radius: validators.requiresProjectileType(`sphereburst`)
	};
</script>

<section>
	<header class="px-8 my-4">
		<h3>
			Weapon Editor
		</h3>
	</header>

	<div class="px-8 py-3 flex flex-row items-center gap-4">
		<button class="btn btn-balc-blue h-10">
			Import
		</button>
		<button class="btn btn-balc-blue h-10">
			Export
		</button>
	</div>

	<div class="px-8 py-3">
		<Tabs>
			<TabList>
				<Tab>Edit</Tab>
				<Tab>Insights</Tab>
				<Tab>Output (JSON)</Tab>
				<Tab>Output (LUA)</Tab>
			</TabList>

			<TabPanel>
				<Tabs>
					<TabList>
						<Tab>Form</Tab>
						<Tab>JSON</Tab>
					</TabList>

					<TabPanel>
						<div class="flex flex-col gap-4">
							<SelectInput bind:value={hide_invalid} options={bool_types} name="show-warnings" label="Hide Disabled Fields?" label_colour_class="text-balc-orange" />
							<FormGroup title="Name:">
								<div class="flex flex-row flex-wrap gap-3">
									<FloatLabelTextInput bind:value={the_weapon.name} name="name" label="Real Name" />
									<FloatLabelTextInput bind:value={the_weapon.display_name} name="display-name" label="Display Name" />
								</div>
							</FormGroup>
							<FormGroup title="StartWeaponConfig Params:">
								<div class="flex flex-row flex-wrap gap-3">
									<SelectInput bind:value={the_weapon.weapon_type} options={weapon_types} name="weapon-type" label="Weapon Type" />
									<SelectInput bind:value={the_weapon.projectile_type} options={projectile_types} name="projectile-types" label="Projectile Type" />
									<SelectInput bind:value={the_weapon.activation_context}
												options={activation_contexts}
												name="activation-contexts"
												label="Activation Context" />
									<FloatLabelTextInput bind:value={the_weapon.projectile_speed} name="projectile-speed" label="Projectile Speed" type="number" />
									<FloatLabelTextInput bind:value={the_weapon.range} name="range" label="Range" type="number" />
									<FloatLabelTextInput bind:value={the_weapon.sphereburst_radius}
														name="sphereburst-radius"
														label="Sphereburst Radius"
														type="number"
														invalid={validation_warnings.sphereburst_radius}
														hide_if_invalid={hide_invalid} />
									<FloatLabelTextInput bind:value={the_weapon.beam_duration}
														name="beam-duration"
														label="Beam Duration"
														type="number"
														invalid={validation_warnings.beam_duration}
														hide_if_invalid={hide_invalid} />
									<FloatLabelTextInput bind:value={the_weapon.beam_anticipation_time}
														name="beam-anticipation-time"
														label="Beam Anticipation Time"
														type="number"
														invalid={validation_warnings.beam_anticipation_time}
														hide_if_invalid={hide_invalid} />
									<FloatLabelTextInput bind:value={the_weapon.missile_fire_axis}
														name="missile-fire-axis"
														label="Missile Fire Axis"
														type="number"
														max={3}
														invalid={validation_warnings.missile_axis}
														hide_if_invalid={hide_invalid} />
									<FloatLabelTextInput bind:value={the_weapon.max_effects} name="max-effects" label="Max Effects" type="number" />
									<SelectInput bind:value={the_weapon.use_velocity_prediction} options={bool_types} name="use-velocity-prediction" label="Velocity Prediction?" />
									<SelectInput bind:value={the_weapon.check_line_of_fire} options={bool_types} name="check-line-of-fire" label="Check Line of Fire?" />
									<FloatLabelTextInput bind:value={the_weapon.shot_interval} name="shot-interval" label="Shot Interval" type="number" />
									<FloatLabelTextInput bind:value={the_weapon.burst_duration} name="burst-duration" label="Burst Duration" type="number" />
									<FloatLabelTextInput bind:value={the_weapon.burst_interval} name="burst-interval" label="Burst Interval" type="number" />
									<SelectInput bind:value={the_weapon.shoot_at_secondaries} options={bool_types} name="shoot-at-secondaries" label="Shoot Secondaries?" />
									<SelectInput bind:value={the_weapon.shoot_at_surroundings} options={bool_types} name="shoot-at-surroundings" label="Shoot Any Nearby?" />
									<FloatLabelTextInput bind:value={the_weapon.tracking_speed_x} name="tracking-speed-x" label="Tracking Speed (Hor.)" type="number" />
									<FloatLabelTextInput bind:value={the_weapon.tracking_speed_y} name="tracking-speed-y" label="Tracking Speed (Ver.)" type="number" />
									<FloatLabelTextInput bind:value={the_weapon.speed_mult_when_over_target} name="speed-mult-when-over-target" label="Speed Mult. Over Target" type="number" />
									<SelectInput bind:value={the_weapon.shield_penetration_mode} options={shield_pen_modes} name="shield-penetration-mode" label="Shield Pen. Mode" />
									<SelectInput bind:value={the_weapon.track_outside_range} options={bool_types} name="track-outside-range" label="Track Outside Range?" />
									<SelectInput bind:value={the_weapon.wait_for_codered} options={bool_types} name="wait-for-codered" label="Wait for Codered?" />
									<FloatLabelTextInput bind:value={the_weapon.beam_penetration_threshold}
														name="beam-penetration-threshold"
														label="Beam Pen. Threshold"
														type="number"
														invalid={validation_warnings.beam_penetration_threshold}
														hide_if_invalid={hide_invalid} />
								</div>
							</FormGroup>
							<FormGroup title="Result">
								<div class="flex flex-row flex-wrap gap-3">
									<SelectInput
										bind:value={the_weapon.weapon_result.condition}
										options={result_conditions}
										name="result-condition"
										label="Condition"
									/>
									<SelectInput
										bind:value={the_weapon.weapon_result.effect}
										options={result_effects}
										name="result-effect"
										label="Effect"
									/>
									<SelectInput
										bind:value={the_weapon.weapon_result.target}
										options={result_targets}
										name="result-target"
										label="Target"
									/>
									<FloatLabelTextInput
										bind:value={the_weapon.weapon_result.effect_min}
										name="result-effect-min"
										label="Min. Effect"
									/>
									<FloatLabelTextInput
										bind:value={the_weapon.weapon_result.effect_max}
										name="result-effect-max"
										label="Max. Effect"
									/>
								</div>
							</FormGroup>
							<FormGroup title="Penetration">
								<div class="flex flex-row flex-wrap gap-3">
									<FloatLabelTextInput
										bind:value={the_weapon.penetration.default}
										name="penetration-default"
										label="Default Penetration"
										type="number"
									/>
									{#each penetration_override_keys as override}
										<FloatLabelTextInput
											bind:value={the_weapon.penetration.exceptions[override]}
											name="penetration-{override}"
											label="vs. {override}"
											type="number"
										/>
									{/each}
									{#if penetration_override_keys.length}
										{#key penetration_override_keys.length}
											<SelectInput
												options={unassigned_penetration_overrides}
												name="add-penetration-override"
												label="+ Add Exception"
												on:selected={addPenetrationOverride}
											/>
										{/key}
									{/if}
								</div>
							</FormGroup>
							<FormGroup title="Accuracy">
								<div class="flex flex-row flex-wrap gap-3">
									<FloatLabelTextInput
										bind:value={the_weapon.accuracy.default}
										name="accuracy-default"
										label="Default Accuracy"
										type="number"
									/>
									{#each accuracy_override_keys as override}
										<FloatLabelTextInput
											bind:value={the_weapon.accuracy.exceptions[override]}
											name="accuracy-{override}"
											label="vs. {override}"
											type="number"
										/>
									{/each}
									{#if accuracy_override_keys.length}
										{#key accuracy_override_keys.length}
											<SelectInput
												options={unassigned_accuracy_overrides}
												name="add-accuracy-override"
												label="+ Add Exception"
												on:selected={addAccuracyOverride}
											/>
										{/key}
									{/if}
								</div>
								<div class="flex flex-row flex-wrap gap-3 items-center">
									{#if !show_accuracy_falloffs}
										<button
											class="btn btn-balc-blue h-10"
											on:click={() => {
												the_weapon.accuracy_falloff = {
													falloff_over_range: 0,
													percentage_start: 1
												};
												show_accuracy_falloffs = true;
											}}
										>
											+ Add Accuracy Falloff
										</button>
									{:else}
										<FloatLabelTextInput
											bind:value={the_weapon.accuracy_falloff.falloff_over_range}
											name="falloff-falloff-over-range"
											label="Falloff / Range"
											type="number"
										/>
										<FloatLabelTextInput
											bind:value={the_weapon.accuracy_falloff.percentage_start}
											name="falloff-percent-start"
											label="Start At (%)"
											type="number"
										/>
										<button
											class="btn btn-balc-blue h-10"
											on:click={() => {
												delete the_weapon.accuracy_falloff;
												show_accuracy_falloffs = false;
											}}
										>
											Remove Falloff
										</button>
									{/if}
								</div>
							</FormGroup>
							<FormGroup title="FX (sound/visual)">
								<div class="flex flex-row flex-wrap gap-3">
									<FloatLabelTextInput
										bind:value={the_weapon.fire_script}
										name="fire-script"
										label="Fire Script"
									/>
									<FloatLabelTextInput
										bind:value={the_weapon.turret_sound}
										name="turret-sound"
										label="Turret Sound"
									/>
								</div>
							</FormGroup>
							<FormGroup title="Fire Cone/Angles">
								<div class="flex flex-row flex-wrap gap-3">
									<FloatLabelTextInput
										bind:value={the_weapon.fire_angles.cone_radius}
										name="angles-cone-radius"
										label="Cone Radius (deg.)"
										type="number"
									/>
									<FloatLabelTextInput
										bind:value={the_weapon.fire_angles.rotate_x_min}
										name="angles-rot-x-min"
										label="Min Horizontal Turn (deg.)"
										type="number"
									/>
									<FloatLabelTextInput
										bind:value={the_weapon.fire_angles.rotate_x_max}
										name="angles-rot-x-max"
										label="Max Horizontal Turn (deg.)"
										type="number"
									/>
									<FloatLabelTextInput
										bind:value={the_weapon.fire_angles.rotate_y_min}
										name="angles-rot-y-min"
										label="Min Vertical Turn (deg.)"
										type="number"
									/>
									<FloatLabelTextInput
										bind:value={the_weapon.fire_angles.rotate_y_max}
										name="angles-rot-y-max"
										label="Max Vertical Turn (deg.)"
										type="number"
									/>
								</div>
							</FormGroup>
							<FormGroup title="Misc.">
								<div class="flex flex-row flex-wrap gap-3 items-center">
									<FloatLabelTextInput
										bind:value={the_weapon.lifetime_mult}
										name="lifetime-mult"
										label="Lifetime Mult."
										type="number"
									/>
									<SelectInput
										bind:value={the_weapon.missile_killer}
										options={bool_types}
										name="missile-killer"
										label="Missile Killer"
									/>
									{#if !show_ballistics}
										<div class="w-full">
											<button
												class="btn btn-balc-blue h-10"
												on:click={() => {
													the_weapon.ballistics = {
														disabled: false,
														lead_amount: 1
													};
													show_ballistics = true;
												}}
											>
												+ Add Ballistics
											</button>
										</div>
									{:else}
										<FormGroup title="Ballistics">
											<div class="flex flex-row flex-wrap gap-3 items-center">
												<SelectInput
													bind:value={the_weapon.ballistics.disabled}
													options={bool_types}
													name="ballistics-enabled"
													label="Disabled"
												/>
												<FloatLabelTextInput
													bind:value={the_weapon.ballistics.lead_amount}
													name="ballistics-lead-amount"
													label="Leading Amount"
													type="number"
												/>
												<button
													class="btn btn-balc-blue h-10"
													on:click={() => {
														delete the_weapon.ballistics;
														show_ballistics = false;
													}}
												>
													Remove Ballistics
												</button>
											</div>
										</FormGroup>
									{/if}
									{#if !show_miss_props}
										<div class="w-full">
											<button
												class="btn btn-balc-blue"
												on:click={() => {
													the_weapon.miss_properties = {
														cone_x_max: 0.1,
														cone_y_max: 0.1,
														damage_mult_low: 0.6,
														damage_mult_high: 0.9,
														projectile_speed_mult: 1,
														projectile_lifetime_mult: 1
													};
													show_miss_props = true;
												}}
											>
												+ Add 'Miss' Properties
											</button>
										</div>
									{:else}
										<FormGroup title="'Miss' Properties">
											<div class="flex flex-row flex-wrap gap-3 items-center">
												<FloatLabelTextInput
													bind:value={the_weapon.miss_properties.cone_x_max}
													name="miss-cone-x-max"
													label="Horizontal Cone Radius"
													type="number"
												/>
												<FloatLabelTextInput
													bind:value={the_weapon.miss_properties.cone_y_max}
													name="miss-cone-y-max"
													label="Vertical Cone Radius"
													type="number"
												/>
												<FloatLabelTextInput
													bind:value={the_weapon.miss_properties.damage_mult_low}
													name="miss-dmg-mult-low"
													label="'Low Damage' Mult."
													type="number"
												/>
												<FloatLabelTextInput
													bind:value={the_weapon.miss_properties.damage_mult_high}
													name="miss-dmg-mult-high"
													label="'High Damage' Mult."
													type="number"
												/>
												<FloatLabelTextInput
													bind:value={the_weapon.miss_properties.projectile_speed_mult}
													name="miss-projectile-speed-mult"
													label="Projectile Speed Mult."
													type="number"
												/>
												<FloatLabelTextInput
													bind:value={the_weapon.miss_properties.projectile_lifetime_mult}
													name="miss-projectile-lifetime-mult"
													label="Projectile Lifetime Mult."
													type="number"
												/>
												<button
													class="btn btn-balc-blue h-10"
													on:click={() => {
														delete the_weapon.miss_properties;
														show_miss_props = false;
													}}
												>
													Remove 'Miss' Properties.
												</button>
											</div>
										</FormGroup>
									{/if}
									{#if !show_mag_pen}
										<div class="w-full">
											<button
												class="btn btn-balc-blue h-10"
												on:click={() => {
													the_weapon.magnetic_field_pen = {
														default: -100
													};
													show_mag_pen = true;
												}}
											>
												+ Add Magnetic Field Pen.
											</button>
										</div>
									{:else}
										<FormGroup title="Magnetic Field Penetration">
											<div class="flex flex-row flex-wrap gap-3 items-center">
												<FloatLabelTextInput
													bind:value={the_weapon.magnetic_field_pen.default}
													name="mag-field-pen-default"
													label="Default Mag. Pen"
													type="number"
												/>
												{#each mag_pen_override_keys as override}
													<FloatLabelTextInput
														bind:value={the_weapon.magnetic_field_pen.exceptions[override]}
														name="mag-field-{override}"
														label="vs. {override}"
														type="number"
													/>
												{/each}
												{#if unassigned_mag_pen_overrides.length}
													{#key mag_pen_override_keys.length}
														<SelectInput
															options={unassigned_mag_pen_overrides}
															name="add-mag-pen-override"
															label="+ Add Exception"
															on:selected={addMagneticFieldOverride}
														/>
													{/key}
												{/if}
												<button
													class="btn btn-balc-blue h-10"
													on:click={() => {
														delete the_weapon.magnetic_field_pen;
														show_mag_pen = false;
													}}
												>
													Remove Magnetic Field Pen.
												</button>
											</div>
										</FormGroup>
									{/if}
									{#if !show_misc_vals}
										<div class="w-full">
											<button
												class="btn btn-balc-blue"
												on:click={() => {
													the_weapon.misc_values = {
														barrel_recoil_distance: 1,
														slave_fire_delay: 0.1
													};
													show_misc_vals = true;
												}}
											>
												+ Add Turret Config ('misc values')
											</button>
										</div>
									{:else}
										<FormGroup title="Turret Config. ('misc values')">
											<div class="flex flex-row flex-wrap gap-3 items-center">
												<FloatLabelTextInput
													bind:value={the_weapon.misc_values.barrel_recoil_distance}
													name="misc-barrel-recoil-distance"
													label="Barrel Recoil Distance"
													type="number"
												/>
												<FloatLabelTextInput
													bind:value={the_weapon.misc_values.slave_fire_delay}
													name="misc-slave-fire-delay"
													label="Slave Fire Delay"
													type="number"
												/>
												<button
													class="btn btn-balc-blue h-10"
													on:click={() => {
														delete the_weapon.misc_values;
														show_misc_vals = false;
													}}
												>
													Remove Turret Config.
												</button>
											</div>
										</FormGroup>
									{/if}
								</div>
							</FormGroup>
						</div>
					</TabPanel>

					<TabPanel>
						json view
					</TabPanel>
				</Tabs>
			</TabPanel>

			<TabPanel>
				insights
			</TabPanel>

			<TabPanel>
				<code>
					<pre>
						{ JSON.stringify(the_weapon, (k, v) => {
							if (v === null || (v instanceof Array && v.length === 0) || (typeof v === `object` && Object.keys(v).length === 0)) {
								return undefined;
							}
							return v;
						}, 4) }
					</pre>
				</code>
			</TabPanel>
			
			<TabPanel>
				LUA
			</TabPanel>
		</Tabs>
	</div>
</section>
