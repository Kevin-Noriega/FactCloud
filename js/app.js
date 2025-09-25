
const API = "https://fakestoreapi.com/users";
const API_PRODUCTS = "https://fakestoreapi.com/products";
const storage = {
  clientes: [],
  productos: [],
  facturas: []
};

// Conversor moneda COP
function formatCOP(n) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

// API Clientes
function consumirAPI() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      // Adaptar datos si es necesario
      storage.clientes = data.map(c => ({
        id: c.id,
        nombre: c.name?.firstname + ' ' + c.name?.lastname,
        email: c.email,
        telefono: c.phone || ''
      }));
      if (document.getElementById('tablaClientes')) initClientes();
      if (document.getElementById('kpiClientes')) initDashboard();
    })
    .catch(error => {
      console.error('Error al consumir API:', error);
    });
}
function consumirAPI2() {

  fetch(API_PRODUCTS)
    .then(res => res.json())
    .then(data => {
      storage.productos = data.map(p => ({
        id: p.id,
        nombre: p.title,
        precio: p.price,
        stock: p.rating?.count || 0,
        stock_min: 5 
      }));
      if (document.getElementById('tablaProductos')) initProductos();
      if (document.getElementById('kpiProductos')) initDashboard();
    })
    .catch(error => {
      console.error('Error al consumir API:', error);
    });
}

document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  window.location.href = 'dashboard.html';
});

// ======================
// Dashboard
// ======================
function initDashboard() {
  const kpiFacturas = document.getElementById('kpiFacturas');
  const kpiClientes = document.getElementById('kpiClientes');
  const kpiIngresos = document.getElementById('kpiIngresos');
  const kpiBajos = document.getElementById('kpiBajos');
  if (kpiFacturas) kpiFacturas.innerText = storage.facturas.length;
  if (kpiClientes) kpiClientes.innerText = storage.clientes.length;
  if (kpiIngresos) {
    const totalIngresos = storage.facturas.reduce((s, f) => s + Number(f.total), 0);
    kpiIngresos.innerText = formatCOP(totalIngresos);
  }
  if (kpiBajos) {
    const bajos = storage.productos.filter(p => p.stock <= p.stock_min && p.stock_min > 0).length;
    kpiBajos.innerText = bajos;
  }

}

// Clientes
function initClientes() {
  const tbody = document.querySelector('#tablaClientes tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  storage.clientes.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.email}</td>
      <td>${c.telefono || ''}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editCliente(${c.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="delCliente(${c.id})">Eliminar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}
function editCliente(id) {
  const cliente = storage.clientes.find(c => c.id === id);
  if (!cliente) {
    alert('Cliente no encontrado');
    return;
  }
  const nombre = prompt('Nuevo nombre del cliente:', cliente.nombre);
  const email = prompt('Nuevo email del cliente:', cliente.email);
  const telefono = prompt('Nuevo teléfono del cliente:', cliente.telefono);
  if (nombre && email) {
    cliente.nombre = nombre;
    cliente.email = email;
    cliente.telefono = telefono;
    initClientes();
    alert('Cliente actualizado correctamente');
  } else {
    alert('Datos inválidos, no se actualizó el cliente');
  }
}
function addCliente() {
  const nombre = prompt('Nombre del cliente:');
  const email = prompt('Email del cliente:');
  const telefono = prompt('Teléfono del cliente:');
  if (nombre && email) {
    const nuevoId = storage.clientes.length ? Math.max(...storage.clientes.map(c => c.id)) + 1 : 1;
    storage.clientes.push({ id: nuevoId, nombre, email, telefono });
    initClientes();
    alert('Cliente agregado correctamente');
  } else {
    alert('Datos inválidos, no se agregó el cliente');
  }
}
function delCliente(id) {
  if (!confirm('¿Seguro que deseas eliminar el cliente ' + id + '?')) return;fetch('https://fakestoreapi.com/users/1', {
  method: 'DELETE'
})
  .then(response => response.json())
    .then(data => {
      console.log('Cliente eliminado:', data);
      // Elimina el cliente del almacenamiento local
      storage.clientes = storage.clientes.filter(c => c.id !== id);
      // Refresca la tabla de clientes
      if (document.getElementById('tablaClientes')) initClientes();
      alert('Cliente eliminado correctamente');
    })
    .catch(error => {
      console.error('Error al eliminar cliente:', error);
      alert('No se pudo eliminar el cliente');
    });
}

//Productos
function initProductos() {
  const tbody = document.querySelector('#tablaProductos tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  storage.productos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${formatCOP(p.precio)}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editProducto(${p.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="delProducto(${p.id})">Eliminar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}
const editProducto=(id) =>{
  const producto = storage.productos.find(p => p.id === id);
  if (!producto) {
    alert('Producto no encontrado');
    return;
  }
  const nombre = prompt('Nuevo nombre del producto:', producto.nombre);
  const precio = parseFloat(prompt('Nuevo precio del producto:', producto.precio));
  const stock = parseInt(prompt('Nuevo stock del producto:', producto.stock));
  if (nombre && !isNaN(pre0cio) && !isNaN(stock)) {
    producto.nombre = nombre;
    producto.precio = precio;
    producto.stock = stock;
    initProductos();
    alert('Producto actualizado correctamente');
  } else {
    alert('Datos inválidos, no se actualizó el producto');
  }
}
function addProducto() {
  const nombre = prompt('Nombre del producto:');
  const precio = parseFloat(prompt('Precio del producto:'));
  const stock = parseInt(prompt('Stock inicial del producto:'));  
  if (nombre && !isNaN(precio) && !isNaN(stock)) {
    const nuevoId = storage.productos.length ? Math.max(...storage.productos.map(p => p.id)) + 1 : 1;
    storage.productos.push({ id: nuevoId, nombre, precio, stock, stock_min: 5 });
    initProductos();
    alert('Producto agregado correctamente');
  } else {
    alert('Datos inválidos, no se agregó el producto');
  }
}

function delProducto(id) {
  if (!confirm('¿Seguro que deseas eliminar el producto ' + id + '?')) return;
  fetch(`https://fakestoreapi.com/products/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      console.log('Producto eliminado:', data);
      // Elimina el producto del almacenamiento local
      storage.productos = storage.productos.filter(p => p.id !== id);
      // Refresca la tabla de productos 
      if (document.getElementById('tablaProductos')) initProductos();
      alert('Producto eliminado correctamente');
    })
    .catch(error => {
      console.error('Error al eliminar producto:', error);
      alert('No se pudo eliminar el producto');
    });
}
//

// Facturas
function initFacturas() {
  const tbody = document.querySelector('#tablaFacturas tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  storage.facturas.forEach(f => {
    const cliente = storage.clientes.find(c => c.id === f.cliente_id) || { nombre: '--' };
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${f.id}</td>
      <td>${cliente.nombre}</td>
      <td>${f.fecha}</td>
      <td>${formatCOP(f.total)}</td>
      <td>${f.estado}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="viewFactura(${f.id})">Ver</button>
      </td>`;
    tbody.appendChild(tr);
  });


  const sel = document.getElementById('selClientes');
  if (sel) {
    sel.innerHTML = '';
    storage.clientes.forEach(c => {
      sel.insertAdjacentHTML('beforeend', `<option value="${c.id}">${c.nombre}</option>`);
    });
  }
}
function viewFactura(id) {
  const factura = storage.facturas.find(f => f.id === id);
  if (!factura) {
    alert('Factura no encontrada');
    return;
  }
  const cliente = storage.clientes.find(c => c.id === factura.cliente_id) || { nombre: '--' };
  let detalles = '';
  factura.items.forEach(item => {
    const prod = storage.productos.find(p => p.id === item.prod) || { nombre: '--' };
    detalles += `- ${prod.nombre}: ${item.cant} x ${formatCOP(prod.precio)} = ${formatCOP(item.sub)}\n`;
  });
  alert(`Factura #${factura.id}\nCliente: ${cliente.nombre}\nFecha: ${factura.fecha}\nEstado: ${factura.estado}\nTotal: ${formatCOP(factura.total)}\n\nDetalles:\n${detalles}`);
}
function addFactura() {
  if (!storage.clientes.length) {
    alert('No hay clientes disponibles');
    return;
  }
  let listaClientes = storage.clientes.map(c => `${c.id}: ${c.nombre}`).join('\n');
  let cliente_id = parseInt(prompt(`Ingrese el ID del cliente:\n${listaClientes}`), 10);
  if (!storage.clientes.find(c => c.id === cliente_id)) {
    alert('Cliente no válido');
    return;
  }

  const fecha = new Date().toISOString().split('T')[0];
  const nuevoId = storage.facturas.length ? Math.max(...storage.facturas.map(f => f.id)) + 1 : 1;

  // Elegir producto disponible
  if (!storage.productos.length) {
    alert('No hay productos disponibles');
    return;
  }
  let listaProductos = storage.productos.map(p => `${p.id}: ${p.nombre} (${formatCOP(p.precio)})`).join('\n');
  let prod_id = parseInt(prompt(`Ingrese el ID del producto:\n${listaProductos}`), 10);
  const producto = storage.productos.find(p => p.id === prod_id);
  if (!producto) {
    alert('Producto no válido');
    return;
  }
  let cantidad = parseInt(prompt(`Ingrese la cantidad de "${producto.nombre}":`), 10);
  if (isNaN(cantidad) || cantidad < 1 || cantidad > producto.stock) {
    alert('Cantidad inválida o insuficiente stock');
    return;
  }
  let subtotal = producto.precio * cantidad;

  // Preguntar si pagó
  let pagada = confirm('¿La factura está pagada?');
  const nuevaFactura = {
    id: nuevoId,
    cliente_id: cliente_id,
    fecha: fecha,
    total: subtotal,
    estado: pagada ? 'Pagada' : 'Pendiente',
    items: [{ prod: prod_id, cant: cantidad, sub: subtotal }]
  };

  // Actualizar stock del producto
  producto.stock -= cantidad;

  storage.facturas.push(nuevaFactura);

  // Actualizar la tabla de facturas si existe
  if (document.getElementById('tablaFacturas')) initFacturas();

  alert('Factura creada correctamente. Puedes agregar productos a la factura.');
}

// Inicialización por vista
document.addEventListener('DOMContentLoaded', () => {
  consumirAPI();
  consumirAPI2();
  if (document.getElementById('kpiFacturas')) initDashboard();
  if (document.getElementById('tablaClientes')) initClientes();
  if (document.getElementById('tablaProductos')) initProductos();
  if (document.getElementById('tablaFacturas')) initFacturas();
  if (document.getElementById('chartVentasMes')) initReportes();
});
