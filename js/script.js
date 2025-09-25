// Script para prototipo: manejo de datos en memoria y UI
const storage = {
  clientes: [
    {id:1,nombre:'Tu Norte TV SAS',email:'info@tunorte.test',telefono:'3001112222'},
    {id:2,nombre:'YAAMSPORT',email:'ventas@yaamsport.test',telefono:'3002223333'}
  ],
  productos: [
    {id:1,nombre:'Producto A',precio:120000,stock:5,stock_min:3},
    {id:2,nombre:'Producto B',precio:45000,stock:1,stock_min:5},
    {id:3,nombre:'Servicio C',precio:250000,stock:100,stock_min:0}
  ],
  facturas: [
    {id:1,cliente_id:1,fecha:'2025-09-05',total:3750000,estado:'Pagada',items:[{prod:1,cant:2,sub:240000}]},
    {id:2,cliente_id:2,fecha:'2025-09-03',total:860000,estado:'Pendiente',items:[{prod:2,cant:1,sub:45000}]}
  ]
};

// UTIL
function formatCOP(n){return new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);}

// Login (demo)
document.getElementById('loginForm')?.addEventListener('submit',function(e){
  e.preventDefault();
  // demo redirect
  window.location.href='dashboard.html';
});

// Inicializar datos en vistas
function initDashboard(){
  document.getElementById('kpiFacturas').innerText = storage.facturas.length;
  document.getElementById('kpiClientes').innerText = storage.clientes.length;
  const totalIngresos = storage.facturas.reduce((s,f)=>s+Number(f.total),0);
  document.getElementById('kpiIngresos').innerText = formatCOP(totalIngresos);
  const bajos = storage.productos.filter(p=>p.stock<=p.stock_min && p.stock_min>0).length;
  document.getElementById('kpiBajos').innerText = bajos;

  // Ultimas facturas list
  const ul = document.getElementById('listaUltimas');
  if(ul){
    ul.innerHTML='';
    storage.facturas.slice(-5).reverse().forEach(f=>{
      const cli = storage.clientes.find(c=>c.id===f.cliente_id) || {nombre:'--'};
      const li = document.createElement('li');
      li.className='list-group-item d-flex justify-content-between align-items-start';
      li.innerHTML = `<div><strong>${cli.nombre}</strong><div class="small text-muted">${f.fecha} · ${f.estado}</div></div><div class="fw-semibold">${formatCOP(f.total)}</div>`;
      ul.appendChild(li);
    });
  }

  // Chart ventas
  const ctx = document.getElementById('chartVentas');
  if(ctx){
    new Chart(ctx,{
      type: 'bar',
      data: {
        labels: ['Mar','Abr','May','Jun','Jul','Ago','Sep'],
        datasets: [{label:'Ventas (M COP)',data:[22,28,24,31,44,50,53]}]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}

function initClientes(){
  const tbody = document.querySelector('#tablaClientes tbody');
  tbody.innerHTML='';
  storage.clientes.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.id}</td><td>${c.nombre}</td><td>${c.email}</td><td>${c.telefono||''}</td>
    <td><button class="btn btn-sm btn-secondary" data-id="${c.id}" onclick="editCliente(${c.id})">Editar</button>
    <button class="btn btn-sm btn-danger" data-id="${c.id}" onclick="delCliente(${c.id})">Eliminar</button></td>`;
    tbody.appendChild(tr);
  });
}

function initProductos(){
  const tbody = document.querySelector('#tablaProductos tbody');
  tbody.innerHTML='';
  storage.productos.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.id}</td><td>${p.nombre}</td><td>${formatCOP(p.precio)}</td><td>${p.stock}</td>
    <td><button class="btn btn-sm btn-secondary" onclick="editProducto(${p.id})">Editar</button>
    <button class="btn btn-sm btn-danger" onclick="delProducto(${p.id})">Eliminar</button></td>`;
    tbody.appendChild(tr);
  });
}

function initFacturas(){
  const tbody = document.querySelector('#tablaFacturas tbody');
  tbody.innerHTML='';
  storage.facturas.forEach(f=>{
    const cliente = storage.clientes.find(c=>c.id===f.cliente_id) || {nombre:'--'};
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${f.id}</td><td>${cliente.nombre}</td><td>${f.fecha}</td><td>${formatCOP(f.total)}</td><td>${f.estado}</td>
    <td><button class="btn btn-sm btn-secondary" onclick="viewFactura(${f.id})">Ver</button></td>`;
    tbody.appendChild(tr);
  });

  // poblar select clientes
  const sel = document.getElementById('selClientes');
  if(sel){
    sel.innerHTML = '';
    storage.clientes.forEach(c=> sel.insertAdjacentHTML('beforeend', `<option value="${c.id}">${c.nombre}</option>`));
  }
}

// CRUD Clientes (simulado)
document.getElementById('btnNuevoCliente')?.addEventListener('click',()=>{
  const modal = new bootstrap.Modal(document.getElementById('modalCliente'));
  document.getElementById('cliNombre').value=''; document.getElementById('cliEmail').value=''; document.getElementById('cliTelefono').value='';
  modal.show();
});
document.getElementById('saveCliente')?.addEventListener('click',()=>{
  const name = document.getElementById('cliNombre').value;
  const email = document.getElementById('cliEmail').value;
  const tel = document.getElementById('cliTelefono').value;
  if(!name||!email) return alert('Completa datos');
  const id = storage.clientes.length?Math.max(...storage.clientes.map(c=>c.id))+1:1;
  storage.clientes.push({id,nombre:name,email,telefono:tel});
  bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
  initClientes(); initFacturas(); initDashboard();
});

// CRUD Productos (simulado)
document.getElementById('btnNuevoProducto')?.addEventListener('click',()=>{
  const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
  document.getElementById('prodNombre').value=''; document.getElementById('prodPrecio').value=''; document.getElementById('prodStock').value='';
  modal.show();
});
document.getElementById('saveProducto')?.addEventListener('click',()=>{
  const name = document.getElementById('prodNombre').value;
  const price = Number(document.getElementById('prodPrecio').value);
  const stock = Number(document.getElementById('prodStock').value);
  if(!name||!price) return alert('Completa datos');
  const id = storage.productos.length?Math.max(...storage.productos.map(p=>p.id))+1:1;
  storage.productos.push({id,nombre:name,precio:price,stock,stock_min:1});
  bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
  initProductos(); initDashboard();
});

// Facturas: agregar ítems
document.getElementById('btnAddItem')?.addEventListener('click',()=>{
  const cont = document.getElementById('factItems');
  const idx = cont.children.length;
  const html = `<div class="row g-2 align-items-center mb-2" data-idx="${idx}">
    <div class="col-md-6">
      <select class="form-select sel-prod">${storage.productos.map(p=>`<option value="${p.id}" data-precio="${p.precio}">${p.nombre}</option>`).join('')}</select>
    </div>
    <div class="col-md-3"><input type="number" class="form-control item-cant" value="1" min="1"></div>
    <div class="col-md-3 text-end"><button class="btn btn-sm btn-danger btn-remove">Quitar</button></div>
  </div>`;
  cont.insertAdjacentHTML('beforeend',html);
  recalcFactura();
  cont.querySelectorAll('.btn-remove').forEach(b=>b.onclick=function(e){ e.target.closest('[data-idx]').remove(); recalcFactura();});
  cont.querySelectorAll('.item-cant, .sel-prod').forEach(el=> el.onchange = recalcFactura);
});

function recalcFactura(){
  const cont = document.getElementById('factItems');
  if(!cont) return;
  let total=0;
  cont.querySelectorAll('.row[data-idx]').forEach(r=>{
    const sel = r.querySelector('.sel-prod');
    const cant = Number(r.querySelector('.item-cant').value||1);
    const precio = Number(sel.options[sel.selectedIndex].dataset.precio||0);
    total += precio*cant;
  });
  document.getElementById('facTotal').value = formatCOP(total);
}

// Guardar factura (simulado)
document.getElementById('saveFactura')?.addEventListener('click',()=>{
  const cliente_id = Number(document.getElementById('selClientes').value);
  const fecha = document.getElementById('facFecha').value || new Date().toISOString().slice(0,10);
  const estado = document.getElementById('facEstado').value;
  const cont = document.getElementById('factItems');
  let total=0; const items=[];
  cont.querySelectorAll('.row[data-idx]').forEach(r=>{
    const sel = r.querySelector('.sel-prod');
    const cant = Number(r.querySelector('.item-cant').value||1);
    const precio = Number(sel.options[sel.selectedIndex].dataset.precio||0);
    items.push({prod:Number(sel.value),cant,sub:precio*cant});
    total += precio*cant;
  });
  const id = storage.facturas.length?Math.max(...storage.facturas.map(f=>f.id))+1:1;
  storage.facturas.push({id,cliente_id,fecha,total,estado,items});
  bootstrap.Modal.getInstance(document.getElementById('modalFactura')).hide();
  initFacturas(); initDashboard();
});

// Utility CRUD remove/edit
function delCliente(id){ if(confirm('Eliminar cliente?')){ storage.clientes = storage.clientes.filter(c=>c.id!==id); initClientes(); initFacturas(); initDashboard();}}
function delProducto(id){ if(confirm('Eliminar producto?')){ storage.productos = storage.productos.filter(p=>p.id!==id); initProductos(); initDashboard();}}
function editCliente(id){ alert('Edición rápida deshabilitada en prototipo.'); }
function editProducto(id){ alert('Edición rápida deshabilitada en prototipo.'); }
function viewFactura(id){ const f = storage.facturas.find(x=>x.id===id); alert('Factura #'+id+'\nCliente:'+ (storage.clientes.find(c=>c.id===f.cliente_id)?.nombre||'--') +'\nTotal:'+ formatCOP(f.total)); }

// Init per page
document.addEventListener('DOMContentLoaded',()=>{
  if(document.body.contains(document.getElementById('kpiFacturas'))) initDashboard();
  if(document.getElementById('tablaClientes')) initClientes();
  if(document.getElementById('tablaProductos')) initProductos();
  if(document.getElementById('tablaFacturas')) initFacturas();

  // Charts on reports page
  const vChart = document.getElementById('chartVentasMes');
  if(vChart){
    new Chart(vChart,{type:'line',data:{labels:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep'],datasets:[{label:'Ventas',data:[5,8,12,14,18,22,26,30,34],tension:0.4,fill:true}]},options:{plugins:{legend:{display:false}}}});
  }
  const pChart = document.getElementById('chartTopProd');
  if(pChart){
    new Chart(pChart,{type:'bar',data:{labels:storage.productos.map(p=>p.nombre),datasets:[{label:'Unidades vendidas',data:[12,8,5],backgroundColor:['#5cc5d9','#a8e6cf','#ffcc99']}]},options:{plugins:{legend:{display:false}}}});
  }
});

// Export CSV
document.getElementById('btnExportCSV')?.addEventListener('click',()=>{
  const rows = [['ID','Cliente','Fecha','Total','Estado']].concat(storage.facturas.map(f=>[f.id, (storage.clientes.find(c=>c.id===f.cliente_id)?.nombre||''), f.fecha, f.total, f.estado]));
  const csv = rows.map(r=> r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='facturas.csv'; a.click(); URL.revokeObjectURL(a.href);
});
