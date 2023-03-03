# Rotaeno capture stablizer
OBS filter for stablizing Rotaeno game capture

中文说明往下翻

Demo 演示 >> [YouTube](https://youtu.be/g9pM9_iQlAE) (AverMedia GC553 XRGB 1080p60)

## Before you start
This plugin depends on the four color squares in the corners when **Streaming Mode** is enabled in game.
The rotation data from the game is "transmitted" by varying the color of these squares.

The exact color value of the color squares matters! **DO NOT** use compressed format, for example MJPEG
or H264, from capture devices, as compression introduces noise, and thus could severely impact the
accuracy of stablization.

Subsampled color formats, like NV12, YV12, or YUY2, are generally safe to use.

The filter samples 4 to 5 pixels from the border of the capture image. If the squares are farther in,
for example because you're using a 21:9 phone and capturing at a 16:9 resolution, you need to
add a **Crop/Pad** filter before this plugin to position the squares correctly.

## Installation
1. Download this repository (above the file list, to the right, select **Code** >> **Download ZIP**)

2. Extract the zip somewhere

3. Open OBS, in the menu bar select **Tools** >> **Scripts**

4. Click the add button

5. Go to where the zip file was extracted to, open the Lua file

6. Close the Scripts dialog

A new filter **Rotaeno Stablizer** will be available in the usual place.

Add it to the filter stack of the capture device, and resize the output on the canvas as needed.

## 注意事项
本滤镜依赖Rotaeno在 **直播模式** 下在画面四角显示的方块。这四个方块的颜色表示当前的旋转角度。

旋转稳定依赖于方块颜色的 **精确值** ，因此在OBS中 **切勿** 使用如MJPEG、H264等的压缩的视频格式。
这种压缩会引入噪音，可能会严重干扰旋转角度的稳定性。

色度抽样的视频格式（如NV12、YV12、YUY2等）一般不会产生噪音，可以使用。

滤镜的采样点固定在视频边界内4~5像素处，如果方块不在这个位置上（比如用16:9的分辨率采集21:9的手机），
请在本滤镜之上增加一个 **裁剪/填充** 滤镜，将多出来的黑边裁掉。

## 安装
1. 下载压缩包（文件列表右上方 **Code** >> **Download ZIP** ）

2. 找个地方解压

3. 打开OBS，在菜单栏选 **工具** >> **脚本**

4. 点击添加按钮（加号）

5. 找到解压的地方，打开Lua文件

6. 关闭脚本对话框

然后滤镜里会多一个 **Rotaeno Stablizer** ，把它加到采集输入的滤镜列表里，然后在场景里调整大小。
