// Design pattern: Strategy.
// Each strategy implements calculate(session) -> number. The weekly calculator
// depends only on this interface, so formulas can be swapped without touching it.
class LoadStrategy {
  calculate() {
    throw new Error('LoadStrategy.calculate() must be implemented');
  }
}

// Default strategy from the requirements: load = duration x effort.
class DurationEffortStrategy extends LoadStrategy {
  calculate({ durationMinutes, effort }) {
    return Number(durationMinutes) * Number(effort);
  }
}

module.exports = { LoadStrategy, DurationEffortStrategy };
