function parseConcurrency(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.max(1, parsed);
}

async function asyncPool(tasks, concurrency) {
  const limit = parseConcurrency(concurrency, 1);
  const results = new Array(tasks.length);
  const errors = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      if (currentIndex >= tasks.length) {
        return;
      }

      try {
        results[currentIndex] = await tasks[currentIndex]();
      } catch (error) {
        errors[currentIndex] = error;
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);

  const failedIndices = errors.map((e, i) => (e ? i : -1)).filter((i) => i >= 0);
  if (failedIndices.length > 0) {
    throw new AggregateError(
      failedIndices.map((i) => errors[i]),
      `${failedIndices.length} of ${tasks.length} tasks failed`
    );
  }

  return results;
}

module.exports = {
  asyncPool
};
