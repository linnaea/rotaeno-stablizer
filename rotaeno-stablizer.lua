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
  data.params.debug = obs.gs_effect_get_param_by_name(data.effect, "debug")
  data.params.circle = obs.gs_effect_get_param_by_name(data.effect, "circle")
  data.params.orient = obs.gs_effect_get_param_by_name(data.effect, "orient")
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
  local parent = obs.obs_filter_get_parent(data.source)
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
  obs.gs_effect_set_int(data.params.orient, data.orient)

  obs.obs_source_process_filter_end(data.source, data.effect, size, size)
end

source_info.get_defaults = function(settings)
  obs.obs_data_set_default_int(settings, "sample_x", 4)
  obs.obs_data_set_default_int(settings, "sample_y", 4)
  obs.obs_data_set_default_bool(settings, "debug", false)
  obs.obs_data_set_default_double(settings, "circle", 0.0)
  obs.obs_data_set_default_int(settings, "orient", 0)
end

source_info.get_properties = function(data)
  local props = obs.obs_properties_create()
  local orient = obs.obs_properties_add_list(props, "orient", "Orientation", obs.OBS_COMBO_TYPE_LIST, obs.OBS_COMBO_FORMAT_INT)
  obs.obs_property_list_add_int(orient, "90 CCW", -1)
  obs.obs_property_list_add_int(orient, "Normal", 0)
  obs.obs_property_list_add_int(orient, "90 CW", 1)
  obs.obs_property_list_add_int(orient, "180", 2)

  obs.obs_properties_add_int(props, "sample_x", "Sample X", 0, 32, 1)
  obs.obs_properties_add_int(props, "sample_y", "Sample Y", 0, 32, 1)
  obs.obs_properties_add_float_slider(props, "circle", "Circular output", 0, 1, 0.001)
  obs.obs_properties_add_bool(props, "debug", "Debug")
  return props
end

source_info.update = function(data, settings)
  data.debug = obs.obs_data_get_bool(settings, "debug")
  data.circle = 0.5 - obs.obs_data_get_double(settings, "circle") / 2
  data.sample_x = obs.obs_data_get_int(settings, "sample_x") + 0.5
  data.sample_y = obs.obs_data_get_int(settings, "sample_y") + 0.5
  data.orient = obs.obs_data_get_int(settings, "orient")
end
