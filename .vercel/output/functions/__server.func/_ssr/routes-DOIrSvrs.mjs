import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Timer, c as Play, d as LayoutGrid, f as Heart, g as ArrowLeft, h as Delete, l as Pause, m as Divide, n as VolumeX, o as Shuffle, p as Flame, r as Volume2, s as Plus, t as X, u as Minus } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DOIrSvrs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium select-none transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-fg text-bg hover:bg-accent",
			secondary: "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-muted hover:bg-elevated hover:text-fg",
			pad: "bg-elevated text-fg font-display tabular-nums shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			enter: "bg-fg text-bg hover:bg-accent"
		},
		size: {
			sm: "h-9 px-3 rounded-[var(--radius-sm)] text-sm",
			md: "h-11 px-4 rounded-[var(--radius-md)] text-sm",
			lg: "h-12 px-5 rounded-[var(--radius-md)] text-base",
			xl: "h-14 px-6 rounded-[var(--radius-lg)] text-base",
			pad: "h-14 rounded-[var(--radius-md)] text-xl",
			icon: "size-11 rounded-[var(--radius-md)]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
});
Button.displayName = "Button";
var OP_SYMBOL = {
	add: "+",
	sub: "−",
	mul: "×",
	div: "÷"
};
var ALL_OPS = [
	"add",
	"sub",
	"mul",
	"div"
];
var nextId = 1;
function randInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}
function pick(items) {
	return items[randInt(0, items.length - 1)];
}
function formatPrompt(a, op, b) {
	return `${a} ${OP_SYMBOL[op]} ${b}`;
}
/** Canonical key so 7×8 and 8×7 share a memory slot. */
function factKey(op, a, b) {
	if (op === "add" || op === "mul") return `${op}:${Math.min(a, b)}:${Math.max(a, b)}`;
	return `${op}:${a}:${b}`;
}
function parseFactKey(key) {
	const parts = key.split(":");
	if (parts.length !== 3) return null;
	const op = parts[0];
	const a = Number(parts[1]);
	const b = Number(parts[2]);
	if (!ALL_OPS.includes(op) || !Number.isFinite(a) || !Number.isFinite(b)) return null;
	return {
		op,
		a,
		b
	};
}
function computeAnswer(a, op, b) {
	switch (op) {
		case "add": return a + b;
		case "sub": return a - b;
		case "mul": return a * b;
		case "div": return b === 0 ? 0 : a / b;
	}
}
var RANGES = {
	easy: {
		addMin: 0,
		addMax: 10,
		mulMin: 1,
		mulMax: 10
	},
	medium: {
		addMin: 1,
		addMax: 20,
		mulMin: 2,
		mulMax: 12
	},
	hard: {
		addMin: 10,
		addMax: 99,
		mulMin: 2,
		mulMax: 12
	}
};
function resolveOp(config) {
	if (config.operation !== "mix") return config.operation;
	return pick(ALL_OPS);
}
function makeProblem(a, op, b) {
	const answer = computeAnswer(a, op, b);
	return {
		id: nextId++,
		a,
		b,
		op,
		answer,
		prompt: formatPrompt(a, op, b),
		factKey: factKey(op, a, b)
	};
}
function operandsFor(op, range, table) {
	if (op === "mul") {
		const focused = table ?? randInt(range.mulMin, range.mulMax);
		const other = randInt(range.mulMin, range.mulMax);
		return Math.random() < .5 ? {
			a: focused,
			b: other
		} : {
			a: other,
			b: focused
		};
	}
	if (op === "div") {
		const divisor = table && table > 0 ? table : randInt(range.mulMin, range.mulMax);
		return {
			a: divisor * randInt(range.mulMin, range.mulMax),
			b: divisor
		};
	}
	if (op === "add") {
		const focused = table ?? randInt(range.addMin, range.addMax);
		const other = randInt(range.addMin, range.addMax);
		return Math.random() < .5 ? {
			a: focused,
			b: other
		} : {
			a: other,
			b: focused
		};
	}
	const max = range.addMax;
	const min = range.addMin;
	let a = table ?? randInt(min, max);
	let b = randInt(min, Math.max(min, a));
	if (table !== null) {
		if (Math.random() < .5) {
			a = Math.max(table, randInt(min, max));
			b = table;
		} else {
			a = table;
			b = randInt(min, table);
		}
	}
	if (a < b) {
		const t = a;
		a = b;
		b = t;
	}
	return {
		a,
		b
	};
}
function accuracy(stat) {
	if (!stat || stat.attempts === 0) return .5;
	return stat.correct / stat.attempts;
}
/**
* Next problem. ~35% of the time, pull from the player's weakest facts
* in the current drill so missed items come back.
*/
function nextProblem(config, facts, avoidKey) {
	const range = RANGES[config.difficulty];
	const op = resolveOp(config);
	const weakPool = Object.entries(facts).filter(([key, stat]) => {
		if (stat.attempts < 1) return false;
		if (accuracy(stat) >= .85 && stat.attempts >= 4) return false;
		const parsed = parseFactKey(key);
		if (!parsed) return false;
		if (config.operation !== "mix" && parsed.op !== config.operation) return false;
		if (config.table !== null) {
			if (parsed.a !== config.table && parsed.b !== config.table) return false;
		}
		return true;
	}).sort((a, b) => accuracy(a[1]) - accuracy(b[1]) || a[1].attempts - b[1].attempts).slice(0, 8);
	if (weakPool.length > 0 && Math.random() < .35) {
		const chosen = pick(weakPool)[0];
		const parsed = parseFactKey(chosen);
		if (parsed && chosen !== avoidKey) {
			if ((parsed.op === "mul" || parsed.op === "add") && Math.random() < .5) return makeProblem(parsed.b, parsed.op, parsed.a);
			return makeProblem(parsed.a, parsed.op, parsed.b);
		}
	}
	for (let i = 0; i < 8; i++) {
		const { a, b } = operandsFor(op, range, config.table);
		const problem = makeProblem(a, op, b);
		if (problem.factKey !== avoidKey) return problem;
	}
	const { a, b } = operandsFor(op, range, config.table);
	return makeProblem(a, op, b);
}
function scoreFor(elapsedMs, combo) {
	const speed = Math.max(0, 120 - elapsedMs / 25);
	const comboMult = 1 + Math.min(8, Math.floor(combo / 3)) * .25;
	return Math.round((80 + speed) * comboMult);
}
function bestKey(config) {
	return `${config.operation}:${config.difficulty}:${config.table ?? "all"}`;
}
function masteryOf(stat) {
	if (!stat || stat.attempts === 0) return "none";
	const acc = accuracy(stat);
	if (stat.attempts >= 5 && acc >= .9) return "mastered";
	if (stat.attempts >= 3 && acc < .6) return "weak";
	return "learning";
}
var ctx = null;
var master = null;
var unlocked = false;
function getCtx() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return null;
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		master.gain.value = .22;
		master.connect(ctx.destination);
	}
	return ctx;
}
function unlockAudio() {
	const audio = getCtx();
	if (!audio || !master) return;
	if (audio.state === "suspended") audio.resume();
	unlocked = true;
}
function resumeAudio() {
	if (!unlocked) return;
	if (ctx && ctx.state === "suspended") ctx.resume();
}
function beep(tones, muted) {
	if (muted || !unlocked) return;
	const audio = getCtx();
	if (!audio || !master) return;
	if (audio.state === "suspended") audio.resume();
	const now = audio.currentTime;
	for (const tone of tones) {
		const osc = audio.createOscillator();
		const gain = audio.createGain();
		osc.type = tone.type;
		osc.frequency.setValueAtTime(tone.freq, now + (tone.delay ?? 0));
		if (tone.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, tone.slide), now + (tone.delay ?? 0) + tone.dur);
		const start = now + (tone.delay ?? 0);
		gain.gain.setValueAtTime(1e-4, start);
		gain.gain.exponentialRampToValueAtTime(tone.gain, start + .012);
		gain.gain.exponentialRampToValueAtTime(1e-4, start + tone.dur);
		osc.connect(gain);
		gain.connect(master);
		osc.start(start);
		osc.stop(start + tone.dur + .02);
		osc.onended = () => {
			osc.disconnect();
			gain.disconnect();
		};
	}
}
function sfxTap(muted) {
	beep([{
		freq: 420,
		dur: .04,
		type: "square",
		gain: .08
	}], muted);
}
function sfxCorrect(muted, combo) {
	const bump = Math.min(6, Math.floor(combo / 3)) * 40;
	beep([{
		freq: 523 + bump,
		dur: .07,
		type: "sine",
		gain: .18
	}, {
		freq: 659 + bump,
		dur: .1,
		type: "sine",
		gain: .16,
		delay: .06
	}], muted);
}
function sfxWrong(muted) {
	beep([{
		freq: 220,
		dur: .18,
		type: "triangle",
		gain: .16,
		slide: 90
	}], muted);
}
function sfxTick(muted) {
	beep([{
		freq: 880,
		dur: .05,
		type: "square",
		gain: .07
	}], muted);
}
function sfxStart(muted) {
	beep([{
		freq: 392,
		dur: .08,
		type: "sine",
		gain: .14
	}, {
		freq: 523,
		dur: .12,
		type: "sine",
		gain: .14,
		delay: .08
	}], muted);
}
var DEFAULT_CONFIG = {
	operation: "mul",
	mode: "sprint",
	difficulty: "medium",
	table: null
};
var KEY = "timesmith.save.v1";
function defaultSave() {
	return {
		version: 1,
		facts: {},
		best: {
			sprint: {},
			streak: {}
		},
		muted: false,
		totals: {
			answered: 0,
			correct: 0
		}
	};
}
function migrate(raw) {
	const base = defaultSave();
	if (!raw || typeof raw !== "object") return base;
	const data = raw;
	return {
		version: 1,
		facts: data.facts && typeof data.facts === "object" ? data.facts : {},
		best: {
			sprint: data.best?.sprint ?? {},
			streak: data.best?.streak ?? {}
		},
		muted: Boolean(data.muted),
		totals: {
			answered: Number(data.totals?.answered) || 0,
			correct: Number(data.totals?.correct) || 0
		}
	};
}
function loadSave() {
	if (typeof window === "undefined") return defaultSave();
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return defaultSave();
		return migrate(JSON.parse(raw));
	} catch {
		return defaultSave();
	}
}
function writeSave(save) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(KEY, JSON.stringify(save));
	} catch {}
}
function persist(save) {
	writeSave(save);
	return save;
}
function recordFact(save, key, correct, elapsedMs) {
	const prev = save.facts[key] ?? {
		attempts: 0,
		correct: 0,
		lastMs: 0,
		avgMs: 0
	};
	const attempts = prev.attempts + 1;
	const nextCorrect = prev.correct + (correct ? 1 : 0);
	const avgMs = Math.round((prev.avgMs * prev.attempts + elapsedMs) / attempts);
	return {
		...save,
		facts: {
			...save.facts,
			[key]: {
				attempts,
				correct: nextCorrect,
				lastMs: elapsedMs,
				avgMs
			}
		},
		totals: {
			answered: save.totals.answered + 1,
			correct: save.totals.correct + (correct ? 1 : 0)
		}
	};
}
var useGame = create((set, get) => ({
	hydrated: false,
	screen: "home",
	config: DEFAULT_CONFIG,
	save: defaultSave(),
	session: null,
	result: null,
	hydrate: () => {
		if (get().hydrated) return;
		set({
			save: loadSave(),
			hydrated: true
		});
	},
	setConfig: (patch) => {
		set((s) => ({ config: {
			...s.config,
			...patch
		} }));
	},
	setMuted: (muted) => {
		set((s) => ({ save: persist({
			...s.save,
			muted
		}) }));
	},
	start: (override) => {
		const config = {
			...get().config,
			...override
		};
		const problem = nextProblem(config, get().save.facts);
		const now = performance.now();
		set({
			config,
			screen: "play",
			result: null,
			session: {
				config,
				problem,
				startedAt: now,
				problemStartedAt: now,
				remainingMs: 6e4,
				lives: 3,
				score: 0,
				combo: 0,
				comboBest: 0,
				correct: 0,
				missed: 0,
				asked: 0,
				paused: false,
				feedback: "idle",
				lastAnswer: null,
				floatScore: null,
				weakThisRun: []
			}
		});
	},
	submit: (value) => {
		const { session, save } = get();
		if (!session || session.paused || session.feedback !== "idle") return;
		const elapsed = Math.max(0, performance.now() - session.problemStartedAt);
		const ok = value === session.problem.answer;
		const combo = ok ? session.combo + 1 : 0;
		const gained = ok ? scoreFor(elapsed, combo) : 0;
		const nextSave = recordFact(save, session.problem.factKey, ok, elapsed);
		const weakThisRun = ok ? session.weakThisRun : [...session.weakThisRun.filter((w) => w.key !== session.problem.factKey), {
			key: session.problem.factKey,
			prompt: session.problem.prompt,
			answer: session.problem.answer
		}];
		set({
			save: persist(nextSave),
			session: {
				...session,
				score: session.score + gained,
				combo,
				comboBest: Math.max(session.comboBest, combo),
				correct: session.correct + (ok ? 1 : 0),
				missed: session.missed + (ok ? 0 : 1),
				asked: session.asked + 1,
				lives: ok ? session.lives : session.lives - 1,
				feedback: ok ? "correct" : "wrong",
				lastAnswer: value,
				floatScore: ok ? gained : null,
				weakThisRun
			}
		});
	},
	tick: (dtMs) => {
		const { session } = get();
		if (!session || session.paused || session.config.mode !== "sprint") return;
		const remainingMs = session.remainingMs - dtMs;
		if (remainingMs <= 0) {
			set({ session: {
				...session,
				remainingMs: 0
			} });
			get().finish();
			return;
		}
		set({ session: {
			...session,
			remainingMs
		} });
	},
	togglePause: () => {
		const { session, screen } = get();
		if (!session || screen !== "play") return;
		set({ session: {
			...session,
			paused: !session.paused
		} });
	},
	finish: () => {
		const { session, save } = get();
		if (!session) return;
		const result = {
			config: session.config,
			score: session.score,
			correct: session.correct,
			missed: session.missed,
			comboBest: session.comboBest,
			elapsedMs: performance.now() - session.startedAt,
			weak: session.weakThisRun.slice(-8)
		};
		const key = bestKey(session.config);
		const nextBest = { ...save.best };
		if (session.config.mode === "sprint") nextBest.sprint = {
			...nextBest.sprint,
			[key]: Math.max(nextBest.sprint[key] ?? 0, session.score)
		};
		if (session.config.mode === "streak") nextBest.streak = {
			...nextBest.streak,
			[key]: Math.max(nextBest.streak[key] ?? 0, session.correct)
		};
		set({
			screen: "results",
			session: null,
			result,
			save: persist({
				...save,
				best: nextBest
			})
		});
	},
	quit: () => {
		const { session } = get();
		if (session && session.asked > 0) {
			get().finish();
			return;
		}
		set({
			screen: "home",
			session: null,
			result: null
		});
	},
	goHome: () => set({
		screen: "home",
		session: null
	}),
	goProgress: () => set({ screen: "progress" })
}));
function advanceAfterFeedback() {
	const state = useGame.getState();
	const session = state.session;
	if (!session) return;
	if (session.config.mode === "streak" && session.lives <= 0) {
		state.finish();
		return;
	}
	if (session.config.mode === "practice" && session.asked >= 20) {
		state.finish();
		return;
	}
	const problem = nextProblem(session.config, state.save.facts, session.problem.factKey);
	useGame.setState({ session: {
		...session,
		problem,
		problemStartedAt: performance.now(),
		feedback: "idle",
		lastAnswer: null,
		floatScore: null
	} });
}
var OPS = [
	{
		id: "mul",
		label: "Multiply",
		hint: "Times tables",
		icon: X
	},
	{
		id: "add",
		label: "Add",
		hint: "Sums",
		icon: Plus
	},
	{
		id: "sub",
		label: "Subtract",
		hint: "Differences",
		icon: Minus
	},
	{
		id: "div",
		label: "Divide",
		hint: "Exact quotients",
		icon: Divide
	},
	{
		id: "mix",
		label: "Mix",
		hint: "All four",
		icon: Shuffle
	}
];
var MODES = [
	{
		id: "sprint",
		label: "Sprint",
		hint: "60 seconds",
		icon: Timer
	},
	{
		id: "streak",
		label: "Streak",
		hint: "3 misses and out",
		icon: Flame
	},
	{
		id: "practice",
		label: "Practice",
		hint: "20 problems",
		icon: LayoutGrid
	}
];
var DIFFS = [
	{
		id: "easy",
		label: "Easy",
		hint: "0–10"
	},
	{
		id: "medium",
		label: "Medium",
		hint: "to 12"
	},
	{
		id: "hard",
		label: "Hard",
		hint: "bigger numbers"
	}
];
var TABLES = [
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12
];
function HomeScreen() {
	const config = useGame((s) => s.config);
	const save = useGame((s) => s.save);
	const setConfig = useGame((s) => s.setConfig);
	const setMuted = useGame((s) => s.setMuted);
	const start = useGame((s) => s.start);
	const goProgress = useGame((s) => s.goProgress);
	const key = bestKey(config);
	const bestSprint = save.best.sprint[key] ?? 0;
	const bestStreak = save.best.streak[key] ?? 0;
	const accuracy = save.totals.answered > 0 ? Math.round(save.totals.correct / save.totals.answered * 100) : null;
	const showTables = config.operation === "mul" || config.operation === "div";
	function begin(override) {
		unlockAudio();
		sfxStart(useGame.getState().save.muted);
		start(override);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-lg flex-col gap-8 px-5 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:pt-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "anim-rise flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.22em] text-muted uppercase",
						children: "Math facts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-[2.6rem] leading-[0.95] font-medium tracking-tight",
						children: "Timesmith"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-[28ch] text-sm text-muted",
						children: "Drill the facts until they are automatic. Type the answer — speed follows accuracy."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": save.muted ? "Unmute" : "Mute",
					onClick: () => {
						unlockAudio();
						setMuted(!save.muted);
					},
					children: save.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "anim-rise",
				style: { animationDelay: "60ms" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase",
					children: "Operation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: OPS.map((op) => {
						const Icon = op.icon;
						const on = config.operation === op.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setConfig({
								operation: op.id,
								table: op.id === "mul" || op.id === "div" ? config.table : null
							}),
							className: cn("flex min-h-16 flex-col items-start gap-1 rounded-[var(--radius-lg)] px-3.5 py-3 text-left transition-[background-color,box-shadow,color] duration-150", op.id === "mix" && "max-sm:col-span-2", on ? "bg-fg text-bg" : "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4 opacity-70",
									strokeWidth: 1.75
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: op.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("text-xs", on ? "text-bg/60" : "text-muted"),
									children: op.hint
								})
							]
						}, op.id);
					})
				})]
			}),
			showTables && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "anim-rise",
				style: { animationDelay: "90ms" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase",
					children: "Table focus"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						label: "All",
						on: config.table === null,
						onClick: () => setConfig({ table: null })
					}), TABLES.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						label: String(n),
						on: config.table === n,
						onClick: () => setConfig({ table: n })
					}, n))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "anim-rise",
				style: { animationDelay: "120ms" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase",
					children: "Mode"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2",
					children: MODES.map((mode) => {
						const Icon = mode.icon;
						const on = config.mode === mode.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setConfig({ mode: mode.id }),
							className: cn("flex min-h-[4.5rem] flex-col items-start gap-1 rounded-[var(--radius-lg)] px-3 py-3 text-left transition-[background-color,box-shadow,color] duration-150", on ? "bg-fg text-bg" : "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4 opacity-70",
									strokeWidth: 1.75
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: mode.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("text-[11px] leading-snug", on ? "text-bg/60" : "text-muted"),
									children: mode.hint
								})
							]
						}, mode.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "anim-rise",
				style: { animationDelay: "150ms" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase",
					children: "Range"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-[var(--radius-lg)] bg-elevated p-1 shadow-[var(--shadow-border)]",
					children: DIFFS.map((d) => {
						const on = config.difficulty === d.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setConfig({ difficulty: d.id }),
							className: cn("flex min-h-11 flex-1 flex-col items-center justify-center rounded-[calc(var(--radius-lg)-4px)] px-2 py-1.5 transition-[background-color,color] duration-150", on ? "bg-fg text-bg" : "text-muted hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: d.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-[11px]", on ? "text-bg/55" : "text-subtle"),
								children: d.hint
							})]
						}, d.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "anim-rise flex flex-col gap-3",
				style: { animationDelay: "180ms" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "xl",
					className: "w-full font-semibold",
					onClick: () => begin(),
					children: "Start drill"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "lg",
					className: "w-full",
					onClick: () => begin({
						operation: "mix",
						mode: "practice",
						difficulty: "easy",
						table: null
					}),
					children: "Quick warm-up"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-3 gap-2 border-t border-border pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Answered",
						value: save.totals.answered ? String(save.totals.answered) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Accuracy",
						value: accuracy !== null ? `${accuracy}%` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: config.mode === "streak" ? "Best streak" : "Best sprint",
						value: config.mode === "streak" ? bestStreak ? String(bestStreak) : "—" : bestSprint ? String(bestSprint) : "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "self-center",
				onClick: goProgress,
				children: "View progress"
			})
		]
	});
}
function Chip({ label, on, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-10 min-w-10 rounded-full px-3 text-sm font-medium tabular-nums transition-[background-color,color] duration-150", on ? "bg-fg text-bg" : "bg-elevated text-muted hover:text-fg"),
		children: label
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-[11px] tracking-wide text-subtle uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 font-display text-xl font-medium tabular-nums",
		children: value
	})] });
}
var KEYS = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"back",
	"0",
	"enter"
];
function NumberPad({ disabled, onDigit, onBack, onEnter }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-3 gap-2",
		role: "group",
		"aria-label": "Number pad",
		children: KEYS.map((key) => {
			if (key === "back") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "pad",
				size: "pad",
				disabled,
				"aria-label": "Backspace",
				onClick: onBack,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, {
					className: "size-5",
					strokeWidth: 1.75
				})
			}, key);
			if (key === "enter") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "enter",
				size: "pad",
				disabled,
				"aria-label": "Submit answer",
				className: "font-sans text-sm font-semibold tracking-wide",
				onClick: onEnter,
				children: "Enter"
			}, key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "pad",
				size: "pad",
				disabled,
				onClick: () => onDigit(key),
				children: key
			}, key);
		})
	});
}
function ProblemCard({ problem, input, feedback, floatScore }) {
	const display = input.length > 0 ? input : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("paper-card relative overflow-hidden rounded-[var(--radius-xl)] px-6 py-8 text-center sm:px-8 sm:py-10", feedback === "wrong" && "anim-shake", feedback === "correct" && "anim-pop"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-sans text-[11px] font-medium tracking-[0.18em] text-ink/45 uppercase",
				children: "Find the answer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-5 text-[clamp(2.4rem,10vw,3.6rem)] leading-none font-medium tracking-tight tabular-nums",
				"aria-live": "polite",
				children: problem.prompt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-end justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-3xl leading-none text-ink/40",
					children: "="
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-display min-w-[3.2ch] border-b-2 pb-1 text-[clamp(2rem,8vw,2.8rem)] leading-none tracking-tight tabular-nums", feedback === "wrong" ? "border-danger text-danger" : "border-ink/25 text-ink", feedback === "correct" && "border-success text-success"),
					children: feedback === "wrong" ? problem.answer : display || "\xA0"
				})]
			}),
			feedback === "wrong" && display && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-ink/50",
				children: ["You entered ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: display
				})]
			}),
			floatScore !== null && feedback === "correct" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "anim-float pointer-events-none absolute top-5 left-1/2 font-sans text-sm font-semibold text-success tabular-nums",
				children: ["+", floatScore]
			})
		]
	}, problem.id);
}
var FEEDBACK_MS = {
	correct: 280,
	wrong: 900
};
function PlayScreen() {
	const session = useGame((s) => s.session);
	const muted = useGame((s) => s.save.muted);
	const setMuted = useGame((s) => s.setMuted);
	const submit = useGame((s) => s.submit);
	const tick = useGame((s) => s.tick);
	const togglePause = useGame((s) => s.togglePause);
	const quit = useGame((s) => s.quit);
	const [input, setInput] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)("");
	const lastTickSecond = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		inputRef.current = "";
		setInput("");
	}, [session?.problem.id]);
	(0, import_react.useEffect)(() => {
		if (!session || session.feedback === "idle") return;
		const ms = FEEDBACK_MS[session.feedback];
		const t = window.setTimeout(() => {
			advanceAfterFeedback();
		}, ms);
		return () => window.clearTimeout(t);
	}, [session?.feedback, session?.problem.id]);
	(0, import_react.useEffect)(() => {
		if (!session || session.config.mode !== "sprint" || session.paused) return;
		let frame = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min(now - last, 100);
			last = now;
			tick(dt);
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frame);
	}, [
		session?.paused,
		session?.config.mode,
		session?.problem.id,
		tick
	]);
	(0, import_react.useEffect)(() => {
		if (!session || session.config.mode !== "sprint") return;
		const sec = Math.ceil(session.remainingMs / 1e3);
		if (sec <= 5 && sec > 0 && lastTickSecond.current !== sec) {
			lastTickSecond.current = sec;
			sfxTick(muted);
		}
	}, [
		session?.remainingMs,
		session?.config.mode,
		muted
	]);
	(0, import_react.useEffect)(() => {
		const onVis = () => {
			if (document.visibilityState === "visible") resumeAudio();
		};
		document.addEventListener("visibilitychange", onVis);
		return () => document.removeEventListener("visibilitychange", onVis);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const current = useGame.getState().session;
			if (!current) return;
			if (e.key === "Escape") {
				togglePause();
				return;
			}
			if (current.paused || current.feedback !== "idle") return;
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			if (e.key >= "0" && e.key <= "9") {
				e.preventDefault();
				appendDigit(e.key);
				return;
			}
			if (e.key === "Backspace") {
				e.preventDefault();
				backspace();
				return;
			}
			if (e.key === "Enter") {
				e.preventDefault();
				commit();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [togglePause]);
	if (!session) return null;
	function appendDigit(d) {
		unlockAudio();
		sfxTap(useGame.getState().save.muted);
		const prev = inputRef.current;
		if (prev.length >= 4) return;
		const next = prev === "0" ? d : prev + d;
		inputRef.current = next;
		setInput(next);
	}
	function backspace() {
		const next = inputRef.current.slice(0, -1);
		inputRef.current = next;
		setInput(next);
	}
	function commit() {
		const raw = inputRef.current;
		if (!raw) return;
		const value = Number(raw);
		if (!Number.isFinite(value)) return;
		const before = useGame.getState().session;
		submit(value);
		const after = useGame.getState().session;
		if (!after || after.feedback === "idle") return;
		if (after.feedback === "correct") sfxCorrect(useGame.getState().save.muted, after.combo);
		else sfxWrong(useGame.getState().save.muted);
		if (before && after.feedback === "wrong") {}
	}
	const locked = session.feedback !== "idle" || session.paused;
	const remainingSec = Math.max(0, Math.ceil(session.remainingMs / 1e3));
	const timerPct = session.remainingMs / 6e4 * 100;
	const practicePct = Math.min(100, session.asked / 20 * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Quit",
						onClick: quit,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HudCenter, {
						sessionMode: session.config.mode,
						remainingSec,
						asked: session.asked,
						feedback: session.feedback
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": session.paused ? "Resume" : "Pause",
							onClick: togglePause,
							children: session.paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": muted ? "Unmute" : "Mute",
							onClick: () => {
								unlockAudio();
								setMuted(!muted);
							},
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" })
						})]
					})
				]
			}),
			session.config.mode === "sprint" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1 overflow-hidden rounded-full bg-elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full rounded-full bg-accent transition-[width] duration-100", remainingSec <= 5 && "bg-danger"),
					style: { width: `${timerPct}%` }
				})
			}),
			session.config.mode === "practice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1 overflow-hidden rounded-full bg-elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-accent",
					style: { width: `${practicePct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-wide text-subtle uppercase",
						children: "Score"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl leading-none font-medium tabular-nums",
						children: session.score
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-wide text-subtle uppercase",
							children: "Combo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("font-display text-2xl leading-none font-medium tabular-nums", session.combo >= 3 && "text-accent"),
							children: session.combo
						})]
					}),
					session.config.mode === "streak" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end gap-1",
						"aria-label": `${session.lives} lives`,
						children: Array.from({ length: 3 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
							className: cn("size-5", i < session.lives ? "fill-danger text-danger" : "text-subtle"),
							strokeWidth: 1.75
						}, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-wide text-subtle uppercase",
							children: "Hit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl leading-none font-medium tabular-nums",
							children: session.correct
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProblemCard, {
					problem: session.problem,
					input,
					feedback: session.feedback,
					floatScore: session.floatScore
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberPad, {
					disabled: locked,
					onDigit: appendDigit,
					onBack: backspace,
					onEnter: commit
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 hidden text-center text-xs text-subtle sm:block",
					children: "Keyboard: digits, Enter, Backspace. Esc pauses."
				})]
			}),
			session.paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-10 flex items-center justify-center bg-bg/80 px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-[var(--radius-xl)] bg-elevated p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-medium",
							children: "Paused"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "The clock is stopped. Resume when you are ready."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								onClick: togglePause,
								children: "Resume"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								size: "lg",
								onClick: quit,
								children: "End drill"
							})]
						})
					]
				})
			})
		]
	});
}
function HudCenter({ sessionMode, remainingSec, asked, feedback }) {
	if (sessionMode === "sprint") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "font-display text-lg font-medium tabular-nums",
		children: [remainingSec, "s"]
	});
	if (sessionMode === "practice") {
		const current = feedback === "idle" ? asked + 1 : asked;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted tabular-nums",
			children: [
				Math.min(Math.max(current, 1), 20),
				" / ",
				20
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Streak"
	});
}
var AXIS = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12
];
function ProgressScreen() {
	const save = useGame((s) => s.save);
	const goHome = useGame((s) => s.goHome);
	const start = useGame((s) => s.start);
	const setConfig = useGame((s) => s.setConfig);
	const accuracy = save.totals.answered > 0 ? Math.round(save.totals.correct / save.totals.answered * 100) : 0;
	let mastered = 0;
	let weak = 0;
	let seen = 0;
	for (const a of AXIS) for (const b of AXIS) {
		if (a > b) continue;
		const stat = save.facts[factKey("mul", a, b)];
		const m = masteryOf(stat);
		if (m !== "none") seen += 1;
		if (m === "mastered") mastered += 1;
		if (m === "weak") weak += 1;
	}
	function drillTable(n) {
		setConfig({
			operation: "mul",
			table: n,
			mode: "practice",
			difficulty: "medium"
		});
		unlockAudio();
		sfxStart(save.muted);
		start({
			operation: "mul",
			table: n,
			mode: "practice",
			difficulty: "medium"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-lg flex-col gap-8 px-5 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": "Back",
					onClick: goHome,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-[0.18em] text-muted uppercase",
					children: "Memory"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-medium tracking-tight",
					children: "Progress"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile$1, {
						label: "Answered",
						value: String(save.totals.answered)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile$1, {
						label: "Accuracy",
						value: save.totals.answered ? `${accuracy}%` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile$1, {
						label: "Mastered",
						value: String(mastered)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex items-end justify-between gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium",
						children: "Times tables"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Color shows how well each product sticks. Tap a row to drill that table."
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-separate border-spacing-0.5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
								className: "sr-only",
								children: "Multiplication mastery grid from 1 to 12"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "w-7 text-[10px] font-medium text-subtle",
								children: "×"
							}), AXIS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-[10px] font-medium text-subtle tabular-nums",
								children: n
							}, n))] }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: AXIS.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => drillTable(row),
									className: "flex size-7 items-center justify-center rounded-[var(--radius-xs)] text-[10px] font-medium text-muted tabular-nums hover:bg-elevated hover:text-fg",
									"aria-label": `Drill the ${row} times table`,
									children: row
								})
							}), AXIS.map((col) => {
								const stat = save.facts[factKey("mul", row, col)];
								const m = masteryOf(stat);
								const acc = stat && stat.attempts > 0 ? Math.round(stat.correct / stat.attempts * 100) : null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										title: acc === null ? `${row} × ${col} — not seen` : `${row} × ${col} — ${acc}% of ${stat?.attempts}`,
										className: cn("block aspect-square min-h-6 rounded-[3px]", m === "none" && "bg-elevated", m === "weak" && "bg-danger/80", m === "learning" && "bg-accent/45", m === "mastered" && "bg-success")
									})
								}, col);
							})] }, row)) })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 flex flex-wrap gap-4 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							swatch: "bg-elevated",
							label: "Unseen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							swatch: "bg-danger/80",
							label: "Weak"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							swatch: "bg-accent/45",
							label: "Learning"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							swatch: "bg-success",
							label: "Mastered"
						})
					]
				}),
				weak > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						weak,
						" product",
						weak === 1 ? "" : "s",
						" need more work. ",
						seen,
						" seen so far."
					]
				})
			] })
		]
	});
}
function Tile$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-lg)] bg-elevated px-3 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] tracking-wide text-subtle uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-display mt-1 text-xl font-medium tabular-nums",
			children: value
		})]
	});
}
function Legend({ swatch, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-[2px]", swatch) }), label]
	});
}
var MODE_LABEL = {
	sprint: "Sprint",
	streak: "Streak",
	practice: "Practice"
};
var OP_LABEL = {
	add: "Addition",
	sub: "Subtraction",
	mul: "Multiplication",
	div: "Division",
	mix: "Mixed"
};
function ResultsScreen() {
	const result = useGame((s) => s.result);
	const save = useGame((s) => s.save);
	const start = useGame((s) => s.start);
	const goHome = useGame((s) => s.goHome);
	const goProgress = useGame((s) => s.goProgress);
	if (!result) return null;
	const drill = result;
	const total = drill.correct + drill.missed;
	const acc = total > 0 ? Math.round(drill.correct / total * 100) : 0;
	const key = bestKey(drill.config);
	const isSprint = drill.config.mode === "sprint";
	const best = isSprint ? save.best.sprint[key] ?? 0 : save.best.streak[key] ?? 0;
	const headline = isSprint ? drill.score : drill.correct;
	const headlineLabel = isSprint ? "Score" : "Correct";
	const isBest = isSprint ? drill.score >= best && drill.score > 0 : drill.correct >= best && drill.correct > 0;
	function again() {
		unlockAudio();
		sfxStart(useGame.getState().save.muted);
		start(drill.config);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-lg flex-col gap-8 px-5 pt-12 pb-[max(2rem,env(safe-area-inset-bottom))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "anim-rise",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-medium tracking-[0.22em] text-muted uppercase",
						children: [
							MODE_LABEL[drill.config.mode],
							" · ",
							OP_LABEL[drill.config.operation],
							drill.config.table ? ` · ${drill.config.table}s` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-3 text-5xl leading-none font-medium tracking-tight tabular-nums",
						children: headline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [headlineLabel, isBest ? " · personal best" : ""]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "anim-rise grid grid-cols-3 gap-3",
				style: { animationDelay: "60ms" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Correct",
						value: String(drill.correct)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Missed",
						value: String(drill.missed)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Accuracy",
						value: `${acc}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Best combo",
						value: String(drill.comboBest)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Best ever",
						value: best ? String(best) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Answered",
						value: String(total)
					})
				]
			}),
			drill.weak.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "anim-rise",
				style: { animationDelay: "100ms" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] font-medium tracking-[0.16em] text-subtle uppercase",
					children: "Review these"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-col gap-2",
					children: drill.weak.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline justify-between rounded-[var(--radius-md)] bg-elevated px-4 py-3 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg",
							children: w.prompt
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-lg text-accent tabular-nums",
							children: ["= ", w.answer]
						})]
					}, w.key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "anim-rise flex flex-col gap-2",
				style: { animationDelay: "140ms" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xl",
						className: "w-full font-semibold",
						onClick: again,
						children: "Drill again"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "lg",
						className: "w-full",
						onClick: goProgress,
						children: "See progress"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "lg",
						className: "w-full",
						onClick: goHome,
						children: "Change drill"
					})
				]
			})
		]
	});
}
function Tile({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-lg)] bg-elevated px-3 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] tracking-wide text-subtle uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-display mt-1 text-xl font-medium tabular-nums",
			children: value
		})]
	});
}
function GameApp() {
	const screen = useGame((s) => s.screen);
	const hydrate = useGame((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		const flush = () => writeSave(useGame.getState().save);
		const onVis = () => {
			if (document.visibilityState === "hidden") flush();
		};
		window.addEventListener("pagehide", flush);
		document.addEventListener("visibilitychange", onVis);
		return () => {
			window.removeEventListener("pagehide", flush);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			screen === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {}),
			screen === "play" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayScreen, {}),
			screen === "results" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsScreen, {}),
			screen === "progress" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressScreen, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { Home as component };
