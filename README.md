StereoWebViewer
===============

Web viewer to display stereo photos for different viewing methods

Status
------

Proof of concept — It is working but has to be improved for better usability.

Abandonned — See [threejs-StereoscopicEffects](https://github.com/JackDesBwa/threejs-StereoscopicEffects) project for a more advanced viewer

Purpose
-------

This project aims to provide a free (to use) viewer to display stereo photo content on websites, without having to generate one image per viewing method.

Input
-----

Input images can be :
Parallel (`p`) or cross (`x`) pair of photographs regrouped side by side in one image

The input mode is set by `data-swv-format` attribute in `img` node of html document.

Output
------

Supported output are :

* Parallel view (`p`)
* Cross view (`x`)
* Anaglyph (`a`) [Dubois color merging method is used]
* interleaved (`i`) [Not tested on actual device yet]
* Left-only (`l`)
* Right only (`r`)

The ouput mode is set by clicking on the image (so that it has focus) and pressing the associated key (e.g. `a` for anaglyph).

API
---

At the time of writing, only automatic convertion is supported: all images whose `img` node has attribute `data-swv-auto="1"` are replaced by viewer version if the browser supports it.

Licence
-------

MIT License

Copyright (c) 2018 JackDesBwa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
