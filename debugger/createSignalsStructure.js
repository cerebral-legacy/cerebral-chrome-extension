function createSignalsStructure(signals) {
  if (!signals.length) {
    return signals;
  }

  var findSignals = function (branches) {
    return branches.reduce(function (signals, branch) {

      // Branch might be an array (async)
      if (Array.isArray(branch)) {
        return signals.concat(findSignals(branch));
      }

      // If is signal
      if (branch.branches) {
        signals = signals.concat(branch);
      }

      // If is action with other signals
      if (branch.signals) {
        signals = branch.signals.reduce(function (signals, signal) {
          return signals.concat(signal).concat(findSignals(signal.branches));
        }, signals)
      }

      // Return by checking any output path
      if (branch.outputPath) {
        return signals.concat(findSignals(branch.outputs[branch.outputPath]));
      }

      return signals;

    }, []);
  };

  return signals.map(function (signal) {
    return [signal].concat(findSignals(signal.branches)).reverse();
  }).reverse();

}
