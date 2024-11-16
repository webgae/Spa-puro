export const blogPage = `
      <div id="inicio"></div>
    <div style="max-width: 800px;margin: auto;padding:1rem;">
      <h1>Blog</h1>
      <div class="field label border">
        <select id="categorias" onchange="filtrarPorCategoria(this.value)">
          <option value="">Todas las categorías</option>
        </select>
        <label>Categorías</label>
      </div>
      <div class="medium-space"></div>
      <div id="posts"></div>
      <div class="large-space"></div>
      <div class="center-align">
        <button id="anterior" onclick="cambiarPagina('anterior')" disabled>Anterior</button>
        <span id="info-pagina">Página 1</span>
        <button id="siguiente" onclick="cambiarPagina('siguiente')">Siguiente</button>
      </div>
    </div>
`;
