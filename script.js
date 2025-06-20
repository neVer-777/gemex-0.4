const tier3Defaults = [44, 85, 165, 400, 1117, 3398, 10500, 32500, 99000, 283000];
const tier4Defaults = [150, 440, 1449, 3484, 10400, 32998, 99111, 283999, 808990, 2000000];

window.onload = () => {
  createInputs('tier3-prices', tier3Defaults, 't3');
  createInputs('tier4-prices', tier4Defaults, 't4');
};

function createInputs(containerId, values, prefix) {
  const container = document.getElementById(containerId);
  values.forEach((val, i) => {
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `${prefix}l${i + 1}`;
    input.value = val;
    input.addEventListener('focus', function () {
      this.select();
    });
    container.appendChild(input);
  });
}

function calculate() {
  const target = parseInt(document.getElementById("targetLevel").value);
  const resultDiv = document.getElementById("result");

  let t3Prices = [], t4Prices = [];
  for (let i = 1; i <= 10; i++) {
    t3Prices.push(Number(document.getElementById(`t3l${i}`).value));
    t4Prices.push(Number(document.getElementById(`t4l${i}`).value));
  }

  const t4Price = t4Prices[target - 1];
  let cheapest = t4Price;
  let method = `Direktkauf eines Tier 4 Level ${target} Gem für ${format(t4Price)}.`;

  let costFusion = 0;
  for (let i = target - 1; i >= 0; i--) {
    costFusion = 3 * (costFusion || t4Prices[i]);
  }
  if (costFusion < cheapest) {
    cheapest = costFusion;
    method = `Fusion von 3 Tier 4 Level ${target - 1} usw. bis Level 1 für ${format(costFusion)}.`;
  }

  const convertMap = {4:6, 5:7, 6:8, 7:9, 8:10, 9:11, 10:12};
  const requiredT3Level = convertMap[target];

  if (requiredT3Level <= 10) {
    let convertCost = t3Prices[requiredT3Level - 1];
    if (convertCost < cheapest) {
      cheapest = convertCost;
      method = `Umwandlung von Tier 3 Level ${requiredT3Level} zu Tier 4 Level ${target} für ${format(convertCost)}.`;
    }
  }

  resultDiv.innerHTML = `
    <strong>Günstigste Methode:</strong><br>
    ${method}<br><br>
    <strong>Gesamtpreis:</strong> ${format(cheapest)}
  `;
}

function format(num) {
  return num.toLocaleString('de-DE');
}
