const API_URL = 'http://localhost:4000/api/auth'

export const loginService = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión')
  return data
}

export const registerService = async (
  nombre: string,
  email: string,
  password: string,
  rol: string,
  apellidos: string,
  telefono: string,
  fecha_nacimiento: string,
  ocupacion: string
) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, apellidos, telefono, email, password, fecha_nacimiento, ocupacion, rol })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al registrarse')
  return data
}
export const getPerfilService = async () => {
  const token = localStorage.getItem('token')
  const res = await fetch('http://localhost:4000/api/usuarios/perfil', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const updatePerfilService = async (datos: {
  nombre: string
  apellidos: string
  telefono: string
  fecha_nacimiento: string
  ocupacion: string
}) => {
  const token = localStorage.getItem('token')
  const res = await fetch('http://localhost:4000/api/usuarios/perfil', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}