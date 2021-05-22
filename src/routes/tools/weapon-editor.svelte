<script lang="ts">
	import { Tab, Tabs, TabList, TabPanel } from 'svelte-tabs';

	import FloatLabelTextInput from '$components/FloatLabelTextInput.svelte';
	import SelectInput from '$components/SelectInput.svelte';
	import FormGroup from '$components/FormGroup.svelte';

	import type { WeaponExt } from '$src/homeworld';
	import { WeaponTypes, ProjectileTypes, ActivationContexts, ShieldPenetrationModes } from '$src/homeworld';

	let the_weapon: Partial<WeaponExt> = {
		weapon_type: `gimble`,
		projectile_type: `bullet`,
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
	};

	const makeSelectInputOpts = (source_arr) => {
		return source_arr.map((thing, index) => ({
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

	let hide_invalid = false;

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
		<SelectInput bind:value={hide_invalid} options={bool_types} name="show-warnings" label="Hide Disabled Fields?" label_colour_class="text-balc-orange" />
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
						<FormGroup title="Name:">
							<FloatLabelTextInput bind:value={the_weapon.name} name="name" label="Real Name" />
							<FloatLabelTextInput bind:value={the_weapon.display_name} name="display-name" label="Display Name" />
						</FormGroup>
						<FormGroup title="StartWeaponConfig Params:">
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
						</FormGroup>
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
				JSON
			</TabPanel>
			
			<TabPanel>
				LUA
			</TabPanel>
		</Tabs>
	</div>
</section>
