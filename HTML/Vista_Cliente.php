<?php
session_start();

// Aceptar dos posibilidades de sesión:
// 1) $_SESSION['usuario'] como array (si algún controlador lo creó)
// 2) Variables individuales creadas por el proceso de login (e.j. 'id_usuario','nombre','correo')
if (!isset($_SESSION['usuario']) && !isset($_SESSION['id_usuario'])) {
    header("Location: Inicio_Secion.html");
    exit();
}

if (isset($_SESSION['usuario']) && is_array($_SESSION['usuario'])) {
    $u = $_SESSION['usuario'];
} else {
    $u = [
        'nombre'   => $_SESSION['nombre'] ?? '',
        'dni'      => $_SESSION['documento'] ?? $_SESSION['doc'] ?? '',
        'correo'   => $_SESSION['correo'] ?? '',
        'telefono' => $_SESSION['telefono'] ?? '',
        'genero'   => $_SESSION['genero'] ?? ''
    ];
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vista Cliente</title>

    <script src="https://kit.fontawesome.com/5ddc7f392f.js" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="../CSS/Vista_Cliente.css">
</head>

<body>
    <header class="cabecera">
        <div class="logo">
            <img src="../IMG/Gemini_Generated_Image_35vftd35vftd35vf-removebg-preview (1).png"
                 alt="Logo">
        </div>

        <nav class="navegacion">
        <a href="../HTML/Inicio.html">Inicio</a>
        <a href="../HTML/Reserva_Pasaje.html">Reservar</a>
        <a href="../HTML/Envios.html" >Envíos</a>
        </nav>
    </header>

    <section class="seccion_superior">
        <h2 class="saludo">¡Hola <?php echo htmlspecialchars( ($u['nombre'] ?? '') . ' ' . ($u['apellido'] ?? ''), ENT_QUOTES, 'UTF-8'); ?>!</h2>

        <div class="tarjeta_usuario">

    <div class="foto_celda">
        <img src="../IMG/profile_user_avatar_person_icon_192481.png" 
             alt="Foto usuario" class="foto_usuario">
    </div>

    <div class="centro"><strong><?php echo htmlspecialchars( ($u['nombre'] ?? '') . ' ' . ($u['apellido'] ?? ''), ENT_QUOTES, 'UTF-8'); ?></strong></div> 
    <div class="centro_botones">
        <button id="editarUsuarioBtn" class="icono_cer" title="Editar usuario" type="button" style="background:none;border:0;padding:0;cursor:pointer;">
            <img src="../IMG/pencil_icon-icons.com_63715.png" alt="Editar_usuario">
        </button>
        <a href="../HTML/Inicio.html" class="icono_cer" alt="Cerrar_sesion"><img src="../IMG/poweroff_87273.png"></a>
    </div>

    <div class="centro">Documento: <?php echo htmlspecialchars($u['dni'] ?? '', ENT_QUOTES, 'UTF-8'); ?></div>
    <div class="centro"></div>

    <div class="centro"><?php echo htmlspecialchars($u['correo'] ?? '', ENT_QUOTES, 'UTF-8'); ?></div>
    <div class="centro"></div>

    <div class="izq">Teléfono:</div>
    <div class="der"><?php echo htmlspecialchars($u['telefono'] ?? '', ENT_QUOTES, 'UTF-8'); ?></div> 

    <div class="izq">Género:</div>
    <div class="der"><?php echo htmlspecialchars($u['genero'] ?? '', ENT_QUOTES, 'UTF-8'); ?></div> 


        </div>
    </section>

    <main class="contenedor_principal">

        <aside class="menu_lateral">

            <div class="item_menu seleccionado">
                <i class="fa-regular fa-user"></i>
                <img src="../IMG/profile_user_avatar_person_icon_192481.png">
                <span>Mi Cuenta</span>
            </div>

            <div class="item_menu">
                <i class="fa-solid fa-suitcase-rolling"></i>
                <img src="../IMG/suitcase_icon_125896.png">
                <span>Mis Viajes</span>
            </div>

            <div class="item_menu">
                <i class="fa-solid fa-bullhorn"></i>
                <img src="../IMG/megaphone_icon_126492.png">
                <span>Promociones</span>
            </div>

        </aside>

        <section class="contenido_derecho">

            <div class="seccion_contenido" id="seccion_mi_cuenta">

                <h2>Mi cuenta</h2>
                <p>Tus viajes, gastos, estadísticas y más.</p>
                <button class="Mis_viajes">Mis viajes</button> 
            </div>

            <div class="seccion_contenido oculto" id="seccion_mis_viajes">

                <h2>Mis viajes</h2>
                <p>Tus viajes, gastos, estadísticas y más.</p>

                <div class="filtros_viajes">
                    <button class="boton_filtro activo">Próximos viajes</button>
                    <button class="boton_filtro">Viajes pasados</button>
                </div>

                <div class="mensaje_sin_viajes">
                    <img src="../IMG/Tickets_43689.png" alt="Sin viajes" class="icono_sin">

                    <h3>¡Todavía no tienes viajes registrados con nosotros!</h3>
                    <p>Anímate a planificar tu próximo y viaja donde y cuando quieras.</p>

                    <button class="boton_buscar_viaje">
                        <a href="../HTML/Reserva_Pasaje.html" class="buscaviaje">¡Busca tu próximo viaje aquí!</a>
                    </button>
                
                </div>

                <!-- Contenedor donde se inyectará la tabla de reservas -->
                <div id="reservasContainer" style="margin-top:18px; display:none;">
                    <!-- tabla se inyecta por JS -->
                </div>
                </div>

            </div>

            <div class="seccion_contenido oculto" id="seccion_promociones">

                <h2>Promociones</h2>
                <p>Descuentos disponibles en tu cuenta.</p>

                <div class="filtros_promos">
                    <button class="boton_filtro activo">Activas</button>
                    <button class="boton_filtro">Inactivas</button>
                </div>

                <p class="mensaje_info">Aquí aparecerán tus promociones cuando estén disponibles.</p>

            </div>

        </section>
    </main>

    <footer class="footer">
    <div class="marca">
      <p>© 2025 BusConnect</p>
    </div>
    <div class="contactos">
      <p>
        <a href="mailto:busconnect@reservabuses.pe" class="correo">busconnect@reservabuses.pe</a>
      </p>
    </div>
    <div class="redes">
      <a href="#"><img src="../IMG/facebook.png" alt="facebook"></a>
      <a href="#"><img src="../IMG/youtube.png" alt="YouTube"></a>
      <a href="#"><img src="../IMG/twitter.png" alt="Twitter"></a>
      <a href="#"><img src="../IMG/instagram.png" alt="Instagram"></a>
      <a href="#"><img src="../IMG/whatsapp.png" alt="WhatsApp"></a>
    </div>
  </footer>

<!-- Modal de edición de usuario -->
<div id="modalEditar" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999;">
    <div class="modal_contenido" style="background:#fff; padding:30px; max-width:500px; width:90%; margin:50px auto; border-radius:8px; position:relative; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <h3 style="margin-top:0; margin-bottom:20px; color:#333;">Editar información</h3>
        <form id="formEditarUsuario">
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-weight:500; color:#555;">Nombre *</label>
                <input type="text" name="nombre" id="e_nombre" value="<?php echo htmlspecialchars($u['nombre'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-size:14px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-weight:500; color:#555;">Apellido</label>
                <input type="text" name="apellido" id="e_apellido" value="<?php echo htmlspecialchars($u['apellido'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-size:14px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-weight:500; color:#555;">Documento</label>
                <input type="text" name="dni" id="e_dni" value="<?php echo htmlspecialchars($u['dni'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-size:14px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-weight:500; color:#555;">Correo *</label>
                <input type="email" name="correo" id="e_correo" value="<?php echo htmlspecialchars($u['correo'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-size:14px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-weight:500; color:#555;">Teléfono</label>
                <input type="text" name="telefono" id="e_telefono" value="<?php echo htmlspecialchars($u['telefono'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-size:14px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-weight:500; color:#555;">Género</label>
                <select name="genero" id="e_genero" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-size:14px;">
                    <option value="" <?php echo (empty($u['genero']) ? 'selected' : ''); ?>>Seleccionar...</option>
                    <option value="Masculino" <?php echo (($u['genero'] ?? '') === 'Masculino' ? 'selected' : ''); ?>>Masculino</option>
                    <option value="Femenino" <?php echo (($u['genero'] ?? '') === 'Femenino' ? 'selected' : ''); ?>>Femenino</option>
                    <option value="Otro" <?php echo (($u['genero'] ?? '') === 'Otro' ? 'selected' : ''); ?>>Otro</option>
                </select>
            </div>

            <div style="margin-top:20px; display:flex; gap:10px; justify-content:flex-end;">
                <button type="button" id="cancelarEditar" style="padding:10px 20px; background:#6c757d; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:14px; font-weight:500;">Cancelar</button>
                <button type="submit" id="guardarEditar" style="padding:10px 20px; background:#007bff; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:14px; font-weight:500;">Guardar</button>
            </div>
            <div id="editarMensaje" style="margin-top:12px; padding:10px; color:#721c24; background:#f8d7da; border:1px solid #f5c6cb; border-radius:4px; display:none; font-size:14px;"></div>
        </form>
    </div>
</div>

<script src="../JAVASCRIPT/Vista_Cliente.js"></script>
</body>
</html>

