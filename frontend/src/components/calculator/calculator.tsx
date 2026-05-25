"use client";

import { useReducer, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Delete, Clock, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────
type Operator = "+" | "-" | "×" | "÷";

interface CalcState {
  display:    string;   // what the user is currently entering
  expression: string;   // e.g. "100 + 50"
  operator:   Operator | null;
  operand:    number | null;
  justEvaled: boolean;  // true right after pressing =
  history:    { expr: string; result: string }[];
}

type CalcAction =
  | { type: "DIGIT";         digit: string }
  | { type: "OPERATOR";      op: Operator }
  | { type: "DECIMAL" }
  | { type: "PERCENT" }
  | { type: "TOGGLE_SIGN" }
  | { type: "BACKSPACE" }
  | { type: "CLEAR" }
  | { type: "EQUALS" }
  | { type: "CLEAR_HISTORY" };

// ── Reducer ────────────────────────────────────────────────
function calcReducer(state: CalcState, action: CalcAction): CalcState {
  const cur = parseFloat(state.display) || 0;

  switch (action.type) {

    case "DIGIT": {
      if (state.display === "0" && action.digit !== ".") {
        return { ...state, display: action.digit, justEvaled: false };
      }
      if (state.justEvaled) {
        return { ...state, display: action.digit, expression: "", justEvaled: false };
      }
      if (state.display.length >= 14) return state;
      return { ...state, display: state.display + action.digit, justEvaled: false };
    }

    case "DECIMAL": {
      if (state.display.includes(".")) return state;
      if (state.justEvaled) return { ...state, display: "0.", expression: "", justEvaled: false };
      return { ...state, display: state.display + "." };
    }

    case "TOGGLE_SIGN": {
      const toggled = cur * -1;
      return { ...state, display: fmt(toggled) };
    }

    case "PERCENT": {
      const pct = state.operand !== null ? (state.operand * cur) / 100 : cur / 100;
      return { ...state, display: fmt(pct) };
    }

    case "BACKSPACE": {
      if (state.justEvaled) return { ...state, display: "0", expression: "", justEvaled: false };
      const next = state.display.length > 1 ? state.display.slice(0, -1) : "0";
      return { ...state, display: next };
    }

    case "CLEAR":
      return { ...INIT_STATE, history: state.history };

    case "CLEAR_HISTORY":
      return { ...state, history: [] };

    case "OPERATOR": {
      const expr = `${fmtExpr(cur)} ${action.op}`;
      if (state.operator && !state.justEvaled) {
        // chain: compute previous op first
        const result = compute(state.operand ?? 0, cur, state.operator);
        return {
          ...state,
          display:    fmt(result),
          expression: `${fmtExpr(result)} ${action.op}`,
          operator:   action.op,
          operand:    result,
          justEvaled: false,
        };
      }
      return {
        ...state,
        expression: expr,
        operator:   action.op,
        operand:    cur,
        justEvaled: false,
      };
    }

    case "EQUALS": {
      if (state.operator === null || state.operand === null) return state;
      const result  = compute(state.operand, cur, state.operator);
      const exprStr = `${fmtExpr(state.operand)} ${state.operator} ${fmtExpr(cur)} =`;
      const entry   = { expr: exprStr, result: fmt(result) };
      return {
        ...state,
        display:    fmt(result),
        expression: exprStr,
        operator:   null,
        operand:    null,
        justEvaled: true,
        history:    [entry, ...state.history].slice(0, 20),
      };
    }

    default: return state;
  }
}

// ── Helpers ────────────────────────────────────────────────
function compute(a: number, b: number, op: Operator): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b !== 0 ? a / b : 0;
  }
}

function fmt(n: number): string {
  if (!isFinite(n)) return "Error";
  // Avoid floating point noise
  const s = parseFloat(n.toPrecision(12)).toString();
  return s;
}

function fmtExpr(n: number): string {
  return n.toString();
}

const INIT_STATE: CalcState = {
  display:    "0",
  expression: "",
  operator:   null,
  operand:    null,
  justEvaled: false,
  history:    [],
};

const LS_KEY = "cf_calc_history";

/** Load persisted history from localStorage (runs once on mount) */
function initCalcState(): CalcState {
  if (typeof window === "undefined") return INIT_STATE;
  try {
    const raw = localStorage.getItem(LS_KEY);
    const history: CalcState["history"] = raw ? JSON.parse(raw) : [];
    return { ...INIT_STATE, history };
  } catch {
    return INIT_STATE;
  }
}

// ── Button config ──────────────────────────────────────────
type BtnVariant = "fn" | "op" | "eq" | "num";

interface BtnCfg {
  label:   string;
  action:  CalcAction;
  variant: BtnVariant;
  wide?:   boolean;
  key?:    string;   // keyboard key
}

const BUTTONS: BtnCfg[] = [
  { label: "C",   action: { type: "CLEAR" },                       variant: "fn",  key: "Escape" },
  { label: "±",   action: { type: "TOGGLE_SIGN" },                 variant: "fn" },
  { label: "%",   action: { type: "PERCENT" },                     variant: "fn",  key: "%" },
  { label: "÷",   action: { type: "OPERATOR", op: "÷" },           variant: "op",  key: "/" },
  { label: "7",   action: { type: "DIGIT",    digit: "7" },        variant: "num", key: "7" },
  { label: "8",   action: { type: "DIGIT",    digit: "8" },        variant: "num", key: "8" },
  { label: "9",   action: { type: "DIGIT",    digit: "9" },        variant: "num", key: "9" },
  { label: "×",   action: { type: "OPERATOR", op: "×" },           variant: "op",  key: "*" },
  { label: "4",   action: { type: "DIGIT",    digit: "4" },        variant: "num", key: "4" },
  { label: "5",   action: { type: "DIGIT",    digit: "5" },        variant: "num", key: "5" },
  { label: "6",   action: { type: "DIGIT",    digit: "6" },        variant: "num", key: "6" },
  { label: "−",   action: { type: "OPERATOR", op: "-" },           variant: "op",  key: "-" },
  { label: "1",   action: { type: "DIGIT",    digit: "1" },        variant: "num", key: "1" },
  { label: "2",   action: { type: "DIGIT",    digit: "2" },        variant: "num", key: "2" },
  { label: "3",   action: { type: "DIGIT",    digit: "3" },        variant: "num", key: "3" },
  { label: "+",   action: { type: "OPERATOR", op: "+" },           variant: "op",  key: "+" },
  { label: "⌫",   action: { type: "BACKSPACE" },                   variant: "fn",  key: "Backspace" },
  { label: "0",   action: { type: "DIGIT",    digit: "0" },        variant: "num", key: "0" },
  { label: ".",   action: { type: "DECIMAL" },                      variant: "num", key: "." },
  { label: "=",   action: { type: "EQUALS" },                      variant: "eq",  key: "Enter" },
];

// ── Display formatter (adds commas) ───────────────────────
function formatDisplay(s: string): string {
  if (s === "Error") return s;
  const [int, dec] = s.split(".");
  const formatted  = parseInt(int || "0", 10).toLocaleString("en-IN");
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

// ── Main component ─────────────────────────────────────────
export function Calculator() {
  // 3rd arg = lazy initializer — reads localStorage only on first render
  const [state, dispatch] = useReducer(calcReducer, undefined, initCalcState);
  const [showHistory, setShowHistory] = useReducer((s: boolean) => !s, false);

  // Persist history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state.history));
    } catch { /* storage full or unavailable */ }
  }, [state.history]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const btn = BUTTONS.find((b) => b.key === e.key);
      if (btn) {
        e.preventDefault();
        dispatch(btn.action);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleBtn = useCallback((action: CalcAction) => {
    dispatch(action);
  }, []);

  const copyResult = () => {
    navigator.clipboard.writeText(state.display);
    toast.success("Copied to clipboard!");
  };

  const displayLen   = state.display.length;
  const displayClass = displayLen > 11 ? "text-3xl" : displayLen > 8 ? "text-4xl" : "text-5xl";

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start justify-center w-full">

      {/* ── Calculator body ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-xs rounded-[2rem] overflow-hidden shadow-2xl border border-border bg-card"
      >

        {/* Display */}
        <div
          className="relative bg-foreground text-background px-6 pt-8 pb-6 cursor-pointer select-none"
          onClick={copyResult}
          title="Click to copy"
        >
          {/* Top row: expression + history toggle */}
          <div className="flex items-start justify-between min-h-[1.5rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={state.expression}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 0.45, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-mono truncate max-w-[200px]"
              >
                {state.expression || " "}
              </motion.p>
            </AnimatePresence>
            <button
              onClick={(e) => { e.stopPropagation(); setShowHistory(); }}
              className={cn(
                "p-1.5 rounded-full transition-colors shrink-0",
                showHistory
                  ? "bg-background/20 text-background"
                  : "text-background/40 hover:text-background/70"
              )}
            >
              <Clock className="h-4 w-4" />
            </button>
          </div>

          {/* Main number */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state.display}
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={cn(
                "font-bold tracking-tight text-right leading-none mt-3 font-mono",
                displayClass
              )}
            >
              {formatDisplay(state.display)}
            </motion.div>
          </AnimatePresence>

          {/* Operator indicator */}
          {state.operator && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-6 text-xs font-bold bg-background/15 text-background rounded-full px-2 py-0.5"
            >
              {state.operator}
            </motion.div>
          )}

          {/* Tap to copy hint */}
          <p className="text-[10px] text-background/25 text-right mt-1">tap to copy</p>
        </div>

        {/* Button grid */}
        <div className="grid grid-cols-4 gap-px bg-border p-px">
          {BUTTONS.map((btn) => (
            <CalcButton
              key={btn.label}
              cfg={btn}
              onClick={() => handleBtn(btn.action)}
            />
          ))}
        </div>

        {/* Quick-add bar */}
        <div className="flex gap-px bg-border border-t border-border">
          <button
            onClick={() => { toast.info("Open the Expenses page and paste the value!"); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-card text-xs font-medium text-danger hover:bg-danger-bg transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
            Add as Expense
          </button>
          <button
            onClick={() => { toast.info("Open the Income page and paste the value!"); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-card text-xs font-medium text-success hover:bg-success-bg transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add as Income
          </button>
        </div>
      </motion.div>

      {/* ── History panel — desktop: side panel, mobile: below calc ── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="flex flex-col w-full max-w-xs md:w-64 max-h-[400px] md:max-h-[520px] rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
          >
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">History</span>
                <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">
                  {state.history.length}/20
                </span>
              </div>
              {state.history.length > 0 && (
                <button
                  onClick={() => {
                    dispatch({ type: "CLEAR_HISTORY" });
                    toast.success("History cleared");
                  }}
                  className="text-xs text-danger hover:text-danger/80 font-medium transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Entries */}
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {state.history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Clock className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs">No calculations yet</p>
                </div>
              ) : (
                state.history.map((h, i) => (
                  <motion.button
                    key={`${h.expr}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    onClick={() => {
                      navigator.clipboard.writeText(h.result);
                      toast.success("Result copied!");
                    }}
                    className="w-full text-right px-4 py-3 hover:bg-accent transition-colors group"
                  >
                    <p className="text-[11px] text-muted-foreground font-mono truncate">{h.expr}</p>
                    <p className="text-base font-bold font-mono mt-0.5 group-hover:text-primary transition-colors">
                      {h.result}
                    </p>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer: storage indicator */}
            <div className="px-4 py-2 border-t border-border shrink-0">
              <p className="text-[10px] text-muted-foreground text-center">
                Saved locally · tap any entry to copy
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── CalcButton ─────────────────────────────────────────────
function CalcButton({ cfg, onClick }: { cfg: BtnCfg; onClick: () => void }) {
  const { label, variant } = cfg;

  const base = "relative flex items-center justify-center h-16 text-lg font-semibold select-none cursor-pointer transition-colors active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const variantClass: Record<BtnVariant, string> = {
    num: "bg-card text-foreground hover:bg-accent",
    fn:  "bg-secondary text-foreground hover:bg-accent",
    op:  "bg-foreground/5 text-foreground hover:bg-foreground/10 font-bold text-xl",
    eq:  "bg-foreground text-background hover:bg-foreground/90 font-bold",
  };

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 600, damping: 20 }}
      className={cn(base, variantClass[variant])}
    >
      {label === "⌫" ? <Delete className="h-5 w-5" /> : label}
      {/* Ripple on tap */}
      <motion.span
        initial={false}
        className="absolute inset-0 rounded-none pointer-events-none"
      />
    </motion.button>
  );
}
