let DameDaneParticleDemo = new DameDaneParticle(document.getElementById('akCanvas'), {
  src: './image/test.png',
  renderX: 30,
  renderY: 60,
  w: 360,
  size: 1,
  spacing: 2,
  effectParticleMode: 'repulsion',
  Thickness: 20
})

let f = false

setInterval(() => {
  f ? DameDaneParticleDemo.ChangeImg('./image/test.png', { renderX: 300, w: 360 }) :
    DameDaneParticleDemo.ChangeImg('./image/island.png', { renderX: 500, renderY: 100, w: 300 })
  f = !f
}, 6000);
