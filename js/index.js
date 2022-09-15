let DameDaneParticleDemo = new DameDaneParticle(document.getElementById('akCanvas'), {
  src: './image/arknight.png',
  renderX: 300,
  renderY: 100,
  w: 600,
  size: 1.2,
  spacing: 1.2,
  validColor: {
    min: 300,
    max: 765,
    invert: false
  },
  effectParticleMode: 'adsorption',
  Thickness: 25,
})

function arknight() {
  DameDaneParticleDemo.ChangeImg('./image/arknight.png', { w: 600 })
}

function island() {
  DameDaneParticleDemo.ChangeImg('./image/island.png', { w: 400 })
}

function longmen() {
  DameDaneParticleDemo.ChangeImg('./image/longmen.png', { w: 450 })
}

function penguin() {
  DameDaneParticleDemo.ChangeImg('./image/penguin.png', { w: 300 })
}

function rhine() {
  DameDaneParticleDemo.ChangeImg('./image/rhine.png', { w: 400 })
}

function reunion() {
  DameDaneParticleDemo.ChangeImg('./image/reunion.jpg', { w: 300 })
}
