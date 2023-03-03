obs = obslua

function script_description()
  return [[Rotaeno Stablization
  This script provides a filter that stablizes Rotaeno game capture.
  Requires Streaming Mode to be enabled in game.]]
end

function script_load(settings)
  obs.obs_register_source(source_info)
end

source_info = {}
source_info.id = 'filter-rotaeno-stablizer'
source_info.type = obs.OBS_SOURCE_TYPE_FILTER
source_info.output_flags = obs.OBS_SOURCE_VIDEO

source_info.get_name = function()
  return "Rotaeno Stablizer"
end


source_info.create = function(settings, source)
  local data = {}
  data.source = source
  data.size = 1280

  obs.obs_enter_graphics()
  local effect_file_path = script_path() .. 'rotaeno-stablizer.effect'
  data.effect = obs.gs_effect_create_from_file(effect_file_path, nil)
  obs.obs_leave_graphics()

  if data.effect == nil then
    source_info.destroy(data)
    return nil
  end

  data.params = {}
  data.params.aspect_s = obs.gs_effect_get_param_by_name(data.effect, "aspect_s")
  data.params.offset_s = obs.gs_effect_get_param_by_name(data.effect, "offset_s")

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
  local size = math.max(width, height)
  data.size = size

  local aspect_s = obs.vec2()
  obs.vec2_set(aspect_s, size / width, size / height)
  local offset_s = obs.vec2()
  obs.vec2_set(offset_s, 4.5 / width, 4.5 / height)

  obs.obs_source_process_filter_begin(data.source, obs.GS_RGBA, obs.OBS_NO_DIRECT_RENDERING)

  obs.gs_effect_set_vec2(data.params.aspect_s, aspect_s)
  obs.gs_effect_set_vec2(data.params.offset_s, offset_s)

  obs.obs_source_process_filter_end(data.source, data.effect, size, size)
end