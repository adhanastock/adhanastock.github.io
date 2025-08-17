(async function () {
    // In dev & prod, /docs is the site root; our JSON is under /data via symlink
    const res = await fetch('/data/dashboard.json').catch(() => null);
    if (!res || !res.ok) {
      document.getElementById('dash').innerHTML = '<p>Could not load data.</p>';
      return;
    }
    const data = await res.json();
    document.getElementById('asof').textContent = new Date(data.as_of).toLocaleString();
  
    const color = (s) => ({ green:'#16a34a', yellow:'#f59e0b', red:'#dc2626', gray:'#6b7280' }[s] || '#6b7280');
    const pill = (label, state) =>
      `<span style="display:inline-block;padding:.15rem .5rem;border-radius:9999px;background:${color(state)}20;color:${color(state)};margin-right:.25rem;font-size:.8rem;">
        ${label}: ${state.toUpperCase()}
       </span>`;
  
    let html = '<table><thead><tr><th>Ticker</th><th>Growth Quality</th><th>Risk</th><th>Exit</th></tr></thead><tbody>';
    for (const row of data.tickers) {
      if (row.error) {
        html += `<tr><td>${row.ticker}</td><td colspan="3" style="color:#dc2626">Error: ${row.error}</td></tr>`;
        continue;
      }
      const g = row.signals.growth_quality, r = row.signals.risk, e = row.signals.exit;
      html += `<tr>
        <td><strong>${row.ticker}</strong></td>
        <td>${pill('Rev', g.rev_growth)} ${pill('Reinvest', g.reinvestment)}</td>
        <td>${pill('Leverage', r.leverage)} ${pill('Buybacks', r.buyback_quality)}</td>
        <td>${pill('AtTarget', e.at_target)} ${pill('Thesis', e.thesis_break)}</td>
      </tr>`;
    }
    html += '</tbody></table>';
  
    const host = document.getElementById('dash');
    host.innerHTML = html;
    host.querySelector('table').style.cssText = 'width:100%;border-collapse:collapse;margin-top:.5rem';
    for (const th of host.querySelectorAll('th')) th.style.cssText = 'text-align:left;border-bottom:1px solid #e5e7eb;padding:.5rem';
    for (const td of host.querySelectorAll('td')) td.style.cssText = 'padding:.5rem;border-bottom:1px solid #f3f4f6';
  })();