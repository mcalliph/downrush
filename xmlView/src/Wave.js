/*
	The wavesurfer wrapper from Waverly, stripped down and modified.
	
*/
import $ from 'jquery';
import WaveSurfer from './js/wavesurfer.js';
import RegionPlugin  from'./js/plugins/wavesurfer.regions.js';
import {TiledRenderer, tiledDrawBuffer} from './js/plugins/wavesurfer.tiledrenderer.js';
import {audioCtx, OfflineContext} from './AudioCtx.js';

function secondsToSampleNum(t, buffer) {
	let sn = t * buffer.sampleRate;
	if (sn < 0) return 0;
	if (sn > buffer.getChannelData(0).length) return buffer.getChannelData(0).length
	return Math.round(sn);
}

export default class Wave {
	constructor(rootDivId, params) {
		this.rootDivId = rootDivId;
		this.initParams = params;
	}

	redrawWave()
	{
		this.surfer.drawBuffer();
		this.surfer.minimap.render();
	}

	openOnBuffer(decoded) {
	var plugs =  [
		RegionPlugin.create({
			dragSelection: false,
			})
		];

	$(this.rootDivId).empty();
	let initParams = {
		container:		this.rootDivId,
		waveColor:		'black',
		progressColor:	'#303030',
		splitChannels:	true,
		interact:		false,
		fillParent:		false,
		scrollParent:	true,
		plugins:		plugs,
		partialRender:  false,
		renderer:		 TiledRenderer,
		// barWidth:		1,
	};

	if (this.params) {
		initParams = Object.assign(initParams, this.params);
	}

	this.surfer = WaveSurfer.create(initParams);
// Patch in an override to the drawBuffer function.
	this.surfer.drawBuffer = tiledDrawBuffer;

	this.surfer.loadBlob(decoded);

// Expose some wavesurfer objects:
	this.backend = this.surfer.backend;
	this.audioContext = this.surfer.backend.ac;

	let me = this;
	this.surfer.on('ready', function () {
		let buf = me.surfer.backend.buffer;
		let dat = buf.getChannelData(0);
		
		let dur = me.surfer.getDuration();
		let w = me.surfer.drawer.getWidth();
		if (dur !== 0) {
			let pps = w / dur * 0.99;
			me.surfer.zoom(pps);
		}
		// me.disableWaveTracker = me.setupWaveTracker();
		
		if (me.initialZone) {
			if (me.initialZone.endMilliseconds === -1) {
				let dur = me.surfer.getDuration();
				me.setSelection(0, dur);
				me.surfer.fireEvent('start-end-change', me);
			} else {
				me.setSelection(me.initialZone.startMilliseconds / 1000, me.initialZone.endMilliseconds / 1000);
			}
		}
		// me.setupSelectionWatcher();
		me.disableWaveTracker = me.setupWaveTracker();
		// me.startGuiCheck();
	})
}	

  getSelection(ipIsAll) {
	let buffer = this.surfer.backend.buffer;
	let srcLen = buffer.getChannelData(0).length;
	let regionMap = this.surfer.regions.list;

	let startT = 0;
	let dur =  this.surfer.getDuration()
	let endT = dur;
	let progS = this.surfer.drawer.progress() * endT;
	let region = regionMap[function() { for (var k in regionMap) return k }()];
	let cursorTime = this.surfer.getCurrentTime();
	let insertionPoint = false;
	
	let cursorPos = secondsToSampleNum(cursorTime, buffer);

	if (region) {
		if (region.start < region.end) {
			startT = region.start;
			endT = region.end;
		} else if(!ipIsAll && region.start === region.end) {
			startT = region.start;
			endT = region.end;
			insertionPoint = true;
		}
	} else {
		if(!ipIsAll) {
			startT = cursorTime;
			endT = cursorTime;
			insertionPoint = true;
		}
	}

	let startS = secondsToSampleNum(startT, buffer);
	let endS = secondsToSampleNum(endT, buffer);
	
	return {
		length: srcLen,
		start:	startT,
		end:	endT,
		first:  startS,
		last:	endS,
		insertionPoint: insertionPoint,
		progress: progS,
		region: region,
		cursorTime: cursorTime,
		cursorPos: 	cursorPos,
		duration:	dur,
	};
}
	setSelection(start, end) {
		this.surfer.regions.clear();
		let pos = {
				start:	start,
				end:	end,
				drag:	true,
				resize: true,
			};
		this.lastRegion = this.surfer.regions.add(pos);
	}

  seekTo(pos) {
  	if(pos < 0) pos = 0;
  	if (pos > 1) pos = 1;
  	this.surfer.seekTo(pos);
  }

  setupSelectionWatcher() {
  	
	let win = $(window);
	let me = this;
// This hack is triggered when the region update ends. It forces the region plugin to only
// retain the most-recently created region.
	function eventUp(e) {
		let regionMap = me.surfer.regions.list;
		let keyCount = Object.keys(regionMap).length;
		if (me.lastRegion && keyCount > 1) {
			me.surfer.regions.list[me.lastRegion.id].remove();
			regionMap = me.surfer.regions.list;
		}
		me.lastRegion = regionMap[function() { for (var k in regionMap) return k }()];
		me.surfer.fireEvent('start-end-change', me, e);
	};
	
	function eventUpdate(e) {
		me.surfer.fireEvent('start-end-change', me, e);
	};

	this.surfer.on('region-update-end', eventUp);
	this.surfer.on('region-updated', eventUpdate);
  }

  setupWaveTracker() {
	var region;
	var dragActive;
	var t0;
	var t1;
	var duration;
	var scroll = this.surfer.params.scrollParent;
	var scrollSpeed = this.surfer.params.scrollSpeed || 1;
	var scrollThreshold = this.surfer.params.scrollThreshold || 10;
	var maxScroll = void 0;
	var scrollDirection = void 0;
	var wrapperRect = void 0;
	var wrapper = this.surfer.drawer.wrapper;
	var repeater;
	
	var me = this;

	var rangeUpdater = function(e) {
		t1 = me.surfer.drawer.handleEvent(e);
		let tS = t0;
		let tE = t1;
		if (t1 < t0) {
			tS = t1;
			tE = t0;
			me.seekTo(t1);
		}
		region.update({
			start:	tS * duration,
			end:	tE * duration
		});
	}

	var edgeScroll = function edgeScroll(e) {
		if (!region || !scrollDirection) return;

	// Update scroll position
		var scrollLeft = wrapper.scrollLeft + scrollSpeed * scrollDirection;
		var nextLeft =  Math.min(maxScroll, Math.max(0, scrollLeft));
		wrapper.scrollLeft = scrollLeft = Math.min(maxScroll, Math.max(0, scrollLeft));
		rangeUpdater(e);
		// Check that there is more to scroll and repeat
		if(scrollLeft < maxScroll && scrollLeft > 0) {
			window.requestAnimationFrame(function () {
			edgeScroll(e);
			});
		}
	};

	var eventMove = function (e) {
		if (!dragActive) return;
		rangeUpdater(e);
		// If scrolling is enabled
		if (scroll && me.surfer.drawer.container.clientWidth < wrapper.scrollWidth) {
			// Check threshold based on mouse
			var x = e.clientX - wrapperRect.left;
			if (x <= scrollThreshold) {
				scrollDirection = -1;
			} else if (x >= wrapperRect.right - scrollThreshold) {
				scrollDirection = 1;
			} else {
				scrollDirection = null;
			}
			scrollDirection && edgeScroll(e);
		}
	}

	var eventUp = function (e) {
		dragActive = false;
		if (region) {
			region.fireEvent('update-end', e);
			me.surfer.fireEvent('region-update-end', region, e);
		}
		region = null;
		let win = $(window); // disconnect listeners.
		win.off('mousemove', eventMove);
		win.off('touchmove', eventMove);
		win.off('mouseup', eventUp);
		win.off('touchend', eventUp);
	}


	var eventDown = function (e) {
		duration = me.surfer.getDuration();
		// Filter out events intended for the scroll bar
		let hasScroll = me.surfer.params.scrollParent;
		let r = e.target.getBoundingClientRect();

		if (hasScroll && e.clientY > (r.bottom - 16)) return; // *** JFF Hack magic number.

		maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
		wrapperRect = wrapper.getBoundingClientRect();

		t0 = me.surfer.drawer.handleEvent(e);

		let xD = e.clientX;

		if (hasScroll) {
			xD += wrapper.scrollLeft;
		}

		t1 = t0;
		if (me.surfer.isPlaying()) {
			dragActive = false;
			let progress = me.surfer.drawer.handleEvent(e);
			me.seekTo(progress);
		} else {
			dragActive = true;
			me.surfer.regions.clear();
			me.seekTo(t0);
			let pos = {
				start:	t0 * duration,
				end:	t1 * duration,
				drag:	false,
				resize: false,
			};
			region = me.surfer.regions.add(pos);
		}
		let win = $(window);
		win.on('mousemove', eventMove); // dynamic listeners
		win.on('touchmove', eventMove);
		win.on('mouseup', eventUp);
		win.on('touchend', eventUp);
		//console.log('down');
	}

	let waveElem = $(this.rootDivId);

	waveElem.on('mousedown', eventDown);
	waveElem.on('touchstart', eventDown);

	return function() {
		waveElem.off('mousedown', eventDown);
		waveElem.off('touchstart', eventDown);
	 };
}




  changeBuffer(buffer) {
	if (!buffer) return;

	let playState = this.surfer.isPlaying();
	let songPos;
	if (playState) {
		console.log('pausing');
		this.surfer.pause();
		songPos = this.surfer.getCurrentTime();
	}

	this.backend.load(buffer);
	this.redrawWave();
	if (playState) {
		if (songPos < 0) songPos = 0;
		let dur = this.surfer.getDuration();
		if (songPos < dur) {
			this.surfer.play(songPos);
			console.log('playing');
		}
	}
}
  copySelected () {
	let buffer = this.surfer.backend.buffer;
	let {length, first, last, region} = this.getSelection(true);
	let ds = last - first;
	let {numberOfChannels, sampleRate} = buffer;
	let nextBuffer = audioCtx.createBuffer(numberOfChannels, ds, sampleRate);

	for (var cx = 0; cx < numberOfChannels; ++cx) {
		let sa = buffer.getChannelData(cx);
		let da = nextBuffer.getChannelData(cx);
		let dx = 0;
		for(var i = first; i < last; ++i) {
			da[dx++] = sa[i];
		}
	}
	return nextBuffer;
}

  getBufferOfLength (duration) {
	let buffer = this.surfer.backend.buffer;
	let {numberOfChannels, sampleRate} = buffer;
	let numSamps = Math.ceil(duration * sampleRate);
	let nextBuffer = audioCtx.createBuffer(numberOfChannels, numSamps, sampleRate);

	for (var cx = 0; cx < numberOfChannels; ++cx) {
		let sa = buffer.getChannelData(cx);
		let da = nextBuffer.getChannelData(cx);
		let dx = 0;
		for(var i = 0; i < numSamps; ++i) {
			da[i] = 0;
		}
	}
	return nextBuffer;
}

  pasteSelected(pasteData, checkInsert) {
	let buffer = this.surfer.backend.buffer;

	let {cursorTime, cursorPos, length, first, last, insertionPoint} = this.getSelection(!checkInsert);

	let pasteLen = pasteData.getChannelData(0).length;
	let dTs = last - first;
	let {numberOfChannels, sampleRate} = buffer;
	let numPasteChannels = pasteData.numberOfChannels;
	let bufLen = length - dTs + pasteLen;
	let nextBuffer = audioCtx.createBuffer(numberOfChannels, bufLen, sampleRate);

	for (var cx = 0; cx < numberOfChannels; ++cx) {
		let sa = buffer.getChannelData(cx);
		let da = nextBuffer.getChannelData(cx);
		let pdx = cx < numPasteChannels ? cx : 0;
		let cb = pasteData.getChannelData(pdx);
		let dx = 0;
		for(var i = 0; i < first; ++i) {
			da[dx++] = sa[i];
		}

		for(var i = 0; i < pasteLen; ++i) {
			da[dx++] = cb[i];
		}

		for(var i = last; i < length; ++i) {
			da[dx++] = sa[i];
		}
	}
	this.changeBuffer(nextBuffer);
	return buffer;
  }

} // End class

export {Wave};
