obs = obslua

LOCALE = {
  script_name = "Rotaeno Stablization",
  script_desc = "  This script provides a filter that stablizes Rotaeno game capture.\n  Requires Streaming Mode and Encoding V2 to be enabled in game.",
  orientation = "Input Orientation",
  orient90cw  = "90 CW (Rotates input 90 CCW)",
  orient90ccw = "90 CCW (Rotates input 90 CW)",
  orient_norm = "Normal",
  orient180   = "180",
  sample_x    = "Sample Offset X",
  sample_y    = "Sample Offset Y",
  circle_out  = "Circular output",
  acquire_thr = "Acquire threshold",
  debug_out   = "Debug output"
}

SHADER = [[
#define PI 3.14159265

uniform float4x4 ViewProj;
uniform texture2d image;

uniform float2 offset_s;
uniform float2 aspect_s;
uniform float acquire;
uniform float circle;
uniform int orient;
uniform bool debug;

sampler_state sp_linear
{
  Filter  = Linear;
  AddressU  = Border;
  AddressV  = Border;
  BorderColor = 00000000;
};

struct vertex_data
{
  float4 pos : POSITION;
  float2 uv  : TEXCOORD0;
};

vertex_data vertex_shader_main(vertex_data v_in)
{
  vertex_data v_out;
  v_out.pos = mul(float4(v_in.pos.xyz, 1.0), ViewProj);
  v_out.uv  = v_in.uv;
  return v_out;
}

float4 pixel_shader_main(vertex_data v_in) : TARGET
{
  float3 sTl = image.Sample(sp_linear, offset_s).rgb;
  float3 sBr = image.Sample(sp_linear, float2(1,1)-offset_s).rgb;
  float3 sTr = image.Sample(sp_linear, float2(1-offset_s.x,offset_s.y)).rgb;
  float3 sBl = image.Sample(sp_linear, float2(offset_s.x,1-offset_s.y)).rgb;
  float3 half = float3(0.5,0.5,0.5);

  float3 acq3 = min(min(abs(sTl - half), abs(sBr - half)), min(abs(sTr - half), abs(sBl - half)));
  float acq = min(min(acq3.x, acq3.y), acq3.z);
  if (acq < acquire) {
    if (debug && v_in.uv.y < 0.01)
      return v_in.uv.x < acq*2 ? float4(1,1,1,1) : v_in.uv.x < acquire*2 ? float4(0,0,0,1) : float4(0,1,0,1);
    return image.Sample(sp_linear, v_in.uv * aspect_s + (1 - aspect_s) / 2);
  }

  switch (orient) {
    case -1: { float3 t = sTl; sTl = sBl; sBl = sBr; sBr = sTr; sTr = t; break; }
    case  1: { float3 t = sTl; sTl = sTr; sTr = sBr; sBr = sBl; sBl = t; break; }
    case  2: { float3 t = sTl; sTl = sBr; sBr = t; t = sTr; sTr = sBl; sBl = t; break; }
  }

  sTl = round(sTl); sTr = round(sTr); sBl = round(sBl); sBr = round(sBr);
  float rtNum = dot(sTl, float3(2048,1024,512)) + dot(sTr, float3(256,128,64)) + dot(sBl, float3(32,16,8)) + dot(sBr, float3(4,2,1));
  float rotation = (rtNum / 2048 + orient / 2.0) * PI;

  if (debug && v_in.uv.y < 0.015 && 0.436 < v_in.uv.x && v_in.uv.x < 0.564) {
    if (v_in.uv.y < 0.008 && v_in.uv.x < 0.56) {
      if (v_in.uv.x > 0.55) return float4(-1,0,sBr.b/5+0.8, 1) + sBr.bbbb/2;
      if (v_in.uv.x > 0.54) return float4(0,sBr.g/2+0.5,0, 1);
      if (v_in.uv.x > 0.53) return float4(sBr.r/2+0.5,-1,0, 1) + sBr.rrrr/4;
      if (v_in.uv.x > 0.52) return float4(-1,0,sBl.b/5+0.8, 1) + sBl.bbbb/2;
      if (v_in.uv.x > 0.51) return float4(0,sBl.g/2+0.5,0, 1);
      if (v_in.uv.x > 0.50) return float4(sBl.r/2+0.5,-1,0, 1) + sBr.rrrr/4;
      if (v_in.uv.x > 0.49) return float4(-1,0,sTr.b/5+0.8, 1) + sTr.bbbb/2;
      if (v_in.uv.x > 0.48) return float4(0,sTr.g/2+0.5,0, 1);
      if (v_in.uv.x > 0.47) return float4(sTr.r/2+0.5,-1,0, 1) + sTr.rrrr/4;
      if (v_in.uv.x > 0.46) return float4(-1,0,sTl.b/5+0.8, 1) + sTl.bbbb/2;
      if (v_in.uv.x > 0.45) return float4(0,sTl.g/2+0.5,0, 1);
      if (v_in.uv.x > 0.44) return float4(sTl.r/2+0.5,-1,0, 1) + sTl.rrrr/4;
    }
    if (v_in.uv.y > 0.01 && v_in.uv.x < 0.56) {
      if (v_in.uv.x > 0.53) return float4(sBr, 1);
      if (v_in.uv.x > 0.50) return float4(sBl, 1);
      if (v_in.uv.x > 0.47) return float4(sTr, 1);
      if (v_in.uv.x > 0.44) return float4(sTl, 1);
    }
    return float4(1,1,1,1);
  }

#ifdef _OPENGL
  mat2 mRotation = mat2(cos(rotation), sin(rotation), -sin(rotation), cos(rotation));
#else
  float2x2 mRotation = {cos(rotation), -sin(rotation), sin(rotation), cos(rotation)};
#endif

  float2 p_source = mul(mRotation, v_in.uv - 0.5) + 0.5;
  if (distance(p_source, half.xy) > circle)
    return float4(0,0,0,0);

  p_source = p_source * aspect_s;
  p_source = p_source + (1 - aspect_s) / 2;
  float2 dist_e = min(float2(1,1)-p_source, p_source) / (debug ? 1 : 2);
  if (dist_e.x <= offset_s.x && dist_e.y <= offset_s.y)
    return float4(0,0,0,0);

  return image.Sample(sp_linear, p_source);
}

technique Draw
{
  pass
  {
    vertex_shader = vertex_shader_main(v_in);
    pixel_shader  = pixel_shader_main(v_in);
  }
}
]]

function script_description()
  load_locale(obs.obs_get_locale())
  return LOCALE.script_name .. "\n" .. LOCALE.script_desc
end

function script_load(settings)
  load_locale(obs.obs_get_locale())
  obs.obs_register_source(source_info)
end

source_info = {
  id = 'filter-rotaeno-stablizer',
  type = obs.OBS_SOURCE_TYPE_FILTER,
  output_flags = obs.OBS_SOURCE_VIDEO
}

source_info.get_name = function()
  return LOCALE.script_name
end

source_info.create = function(settings, source)
  local data = {}
  data.source = source
  data.size = 1280

  obs.obs_enter_graphics()
  data.effect = obs.gs_effect_create(SHADER, nil, nil)
  obs.obs_leave_graphics()

  if data.effect == nil then
    source_info.destroy(data)
    return nil
  end

  data.params = {}
  data.params.debug = obs.gs_effect_get_param_by_name(data.effect, "debug")
  data.params.circle = obs.gs_effect_get_param_by_name(data.effect, "circle")
  data.params.orient = obs.gs_effect_get_param_by_name(data.effect, "orient")
  data.params.acquire = obs.gs_effect_get_param_by_name(data.effect, "acquire")
  data.params.aspect_s = obs.gs_effect_get_param_by_name(data.effect, "aspect_s")
  data.params.offset_s = obs.gs_effect_get_param_by_name(data.effect, "offset_s")

  source_info.update(data, settings)
  return data
end

source_info.destroy = function(data)
  if data.effect ~= nil then
    obs.obs_enter_graphics()
    obs.gs_effect_destroy(data.effect)
    data.effect = nil
    obs.obs_leave_graphics()
  end
end

source_info.get_width = function(data)
  return data.size
end

source_info.get_height = function(data)
  return data.size
end

source_info.video_render = function(data)
  local parent = obs.obs_filter_get_target(data.source)
  local width = obs.obs_source_get_base_width(parent)
  local height = obs.obs_source_get_base_height(parent)
  local size = math.ceil(math.sqrt(width*width + height*height))
  data.size = size

  local aspect_s = obs.vec2()
  obs.vec2_set(aspect_s, size / width, size / height)
  local offset_s = obs.vec2()
  obs.vec2_set(offset_s, data.sample_x / width, data.sample_y / height)

  obs.obs_source_process_filter_begin(data.source, obs.GS_RGBA, obs.OBS_NO_DIRECT_RENDERING)

  obs.gs_effect_set_vec2(data.params.aspect_s, aspect_s)
  obs.gs_effect_set_vec2(data.params.offset_s, offset_s)
  obs.gs_effect_set_bool(data.params.debug, data.debug)
  obs.gs_effect_set_float(data.params.circle, data.circle)
  obs.gs_effect_set_float(data.params.acquire, data.acquire)
  obs.gs_effect_set_int(data.params.orient, data.orient)

  obs.obs_source_process_filter_end(data.source, data.effect, size, size)
end

source_info.get_defaults = function(settings)
  obs.obs_data_set_default_int(settings, "sample_x", 4)
  obs.obs_data_set_default_int(settings, "sample_y", 4)
  obs.obs_data_set_default_bool(settings, "debug", false)
  obs.obs_data_set_default_double(settings, "circle", 0.0)
  obs.obs_data_set_default_double(settings, "acquire", 0.6)
  obs.obs_data_set_default_int(settings, "orient", 0)
end

source_info.get_properties = function(data)
  load_locale(obs.obs_get_locale())

  local props = obs.obs_properties_create()
  local orient = obs.obs_properties_add_list(props, "orient", LOCALE.orientation, obs.OBS_COMBO_TYPE_LIST, obs.OBS_COMBO_FORMAT_INT)
  obs.obs_property_list_add_int(orient, LOCALE.orient90ccw, -1)
  obs.obs_property_list_add_int(orient, LOCALE.orient_norm, 0)
  obs.obs_property_list_add_int(orient, LOCALE.orient90cw, 1)
  obs.obs_property_list_add_int(orient, LOCALE.orient180, 2)

  obs.obs_properties_add_int(props, "sample_x", LOCALE.sample_x, 0, 32, 1)
  obs.obs_properties_add_int(props, "sample_y", LOCALE.sample_y, 0, 32, 1)
  obs.obs_properties_add_float_slider(props, "circle", LOCALE.circle_out, 0, 1, 0.001)
  obs.obs_properties_add_float_slider(props, "acquire", LOCALE.acquire_thr, 0, 1, 0.001)
  obs.obs_properties_add_bool(props, "debug", LOCALE.debug_out)
  return props
end

source_info.update = function(data, settings)
  data.debug = obs.obs_data_get_bool(settings, "debug")
  data.circle = 0.5 - obs.obs_data_get_double(settings, "circle") / 2
  data.acquire = obs.obs_data_get_double(settings, "acquire") / 2
  data.sample_x = obs.obs_data_get_int(settings, "sample_x") + 0.5
  data.sample_y = obs.obs_data_get_int(settings, "sample_y") + 0.5
  data.orient = obs.obs_data_get_int(settings, "orient")
end

function load_locale(locale_id)
  local ok, lines = pcall(io.lines, script_path() .. locale_id .. '.ini')
  if not ok then return end

  for line in lines do
    local equ = string.find(line, '=', 1, true)
    if equ and equ > 1 then
      local k = string.sub(line, 1, equ - 1):match("^%s*(.-)%s*$")
      local v = string.sub(line, equ + 1):match("^%s*(.-)%s*$")
      ok, v = pcall((loadstring or load)('return ' .. v))
      if ok then LOCALE[k] = v end
    end
  end

  LOCALE.locale_id = locale_id
end
