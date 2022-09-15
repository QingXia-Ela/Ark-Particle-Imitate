let DameDaneParticleDemo = new DameDaneParticle(document.getElementById('akCanvas'), {
  src: './image/test2.jpg',
  renderX: 400,
  renderY: 100,
  w: 300,
  size: 1.5,
  spacing: 2,
  validColor: {
    min: 100,
    max: 765,
    invert: false
  },
  effectParticleMode: 'repulsion',
  Thickness: 40,
  cancelParticleAnimation: true
})

setTimeout(() => {
  DameDaneParticleDemo.ChangeImg('./image/test.jpg')

}, 3000);
let f = false
