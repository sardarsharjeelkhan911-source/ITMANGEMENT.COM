import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { rmSync } from 'node:fs'
process.env.DATA_FILE = '/tmp/itmanagement-api-test.json'
process.env.JWT_SECRET = 'test-secret-that-is-long-enough'
rmSync(process.env.DATA_FILE, { force: true })
const { app } = await import('../index.mjs')
let server, base
test.before(async () => { server=createServer(app); await new Promise(r=>server.listen(0,r)); base=`http://127.0.0.1:${server.address().port}` })
test.after(() => server.close())
test('registration, authentication, cart, and server-calculated COD order', async () => { const reg=await fetch(`${base}/api/auth/register`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Amina Khan',email:'amina@example.test',password:'password123'})});assert.equal(reg.status,201);const cookie=reg.headers.get('set-cookie');assert.ok(cookie);const products=await (await fetch(`${base}/api/products`)).json();assert.equal(products.data.length,2);const add=await fetch(`${base}/api/cart/items`,{method:'POST',headers:{'content-type':'application/json',cookie},body:JSON.stringify({productId:products.data[0].id,quantity:1})});assert.equal(add.status,201);const order=await fetch(`${base}/api/orders`,{method:'POST',headers:{'content-type':'application/json',cookie},body:JSON.stringify({customerName:'Amina Khan',email:'amina@example.test',phone:'03000000000',shippingAddress:'1 Main Street',city:'Karachi',postalCode:'74000',country:'Pakistan',paymentMethod:'COD'})});assert.equal(order.status,201);const body=await order.json();assert.equal(body.data.paymentStatus,'PENDING');assert.equal(body.data.orderStatus,'PENDING');assert.ok(body.data.total>0) })
test('protected admin dashboard rejects anonymous visitors', async()=>{const response=await fetch(`${base}/api/admin/dashboard`);assert.equal(response.status,401)})
