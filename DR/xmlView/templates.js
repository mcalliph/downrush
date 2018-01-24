// Mustache tamplates
var track_head_template = Handlebars.compile(`<table>

<tr>
<th> </th>
<th>Section</th>
<th>Type</th>
<th>Preset #</th>
<th>Name</th>
<th>Length</th>
<th>Colour</th>
<th>Info</th>
</tr>
<tr>
<td class='soundviewbtn' trackno='{{trackNum}}'>&#x25BA</td>
<td>{{section}}</td>
<td>{{kindName}}</td>
<td>{{patch}}</td>
<td>{{patchName}}</td>
<td>{{len}}</td>
<td>{{colourOffset}}</td>
<td>{{info}}</td>
</tr>
</table><p class='tinygap'>
<div id='snd_place{{trackNum}}'> </div>`);

var track_copy_template = Handlebars.compile(`<input type='button' class='clipbtn' value='Copy To Clipboard' trackno='{{trackNum}}'><p/>`);
/*
var sound_view_template = `<input type='button' class='soundviewbtn' value='View Sound Info' trackno='{{trackNum}}'><p/>
	<div id='snd_place{{trackNum}}'> </div>`;
*/

var paster_template = Handlebars.compile(`<hr><div>
			<b>Paste track data in field below to add it to song.</b><br>
			<textarea id='paster' rows='2' class='tinybox'></textarea>{{#iOSDevice}}<br><input type='button' value='Add Track' id='iosSubmit'>{{/iOSDevice}}
		</div><p class='tinygap'>`);

// This table expands into a parameter display which follows the
// "Shortcut template" layout:
// 
/* Vertical grouping class names
sample1
audio
zone
sample2
osc1
osc2
fmmod1
fmmod2
master
distortion
voice
unison
envelope1
lpf
envelope2
hpf
sidechain
arp
lfo1
modfx
lfo2
reverb
delay
modsources

/// Horizontal grouping class names
start
frequency
end
destination
resonance
adjust
browse
feedback
dboct
record
retrigphase
pitchtime
pw
attack
amount
speed
type
decay
shape
reverse
transpose
sustain
sync
mode
volume
release
rate

*/
var modKnobTemplate = Handlebars.compile(`<table class='mod_knobs'>
<!-- Mod Knob Mappings -->
<tr>
<th class='mkhead' colspan='8'>{{title}}</th>
</tr>
</tr>
<tr>
<th class='mkhead'>Volume</th>
<th class='mkhead'>Cutoff/FM</th>
<th class='mkhead'>Attack</th>
<th class='mkhead'>Delay Time</th>

<th class='mkhead'>Sidechain</th>
<th class='mkhead'>Mod Rate</th>
<th class='mkhead'>Stutter</th>
<th class='mkhead'>Custom 2</th>
</tr>
<tr>
<td class='mkhdata'>{{mk1}}</td>
<td class='mkhdata'>{{mk3}}</td>
<td class='mkhdata'>{{mk5}}</td>
<td class='mkhdata'>{{mk7}}</td>

<td class='mkhdata'>{{mk9}}</td>
<td class='mkhdata'>{{mk11}}</td>
<td class='mkhdata'>{{mk13}}</td>
<td class='mkhdata'>{{mk15}}</td>
</tr>
<tr>
<th class='mkhead'>Pan</th>
<th class='mkhead'>Res/FM</th>
<th class='mkhead'>Release</th>
<th class='mkhead'>Amount</th>

<th class='mkhead'>Reverb</th>
<th class='mkhead'>Depth</th>
<th class='mkhead'>Custom 1</th>
<th class='mkhead'>Custom 3</th>
</tr>
<tr>
<td class='mkhdata'>{{mk0}}</td>
<td class='mkhdata'>{{mk2}}</td>
<td class='mkhdata'>{{mk4}}</td>
<td class='mkhdata'>{{mk6}}</td>

<td class='mkhdata'>{{mk8}}</td>
<td class='mkhdata'>{{mk10}}</td>
<td class='mkhdata'>{{mk12}}</td>
<td class='mkhdata'>{{mk14}}</td>
</tr>
</table><p class='tinygap'>`);

var sample_list_header = Handlebars.compile(`<tr class='kithead'>
<th> </th>
<th>Name</th>
<th>Path</th>
<th>Start</th>
<th>End</th>
<th>Osc2 Path</th>
<th>Osc2 Start</th>
<th>Osc2 End</th>
</tr>`);

var sample_entry_template = Handlebars.compile(`<tr class='kitentry'>
<td class='kit_opener' kitItem='{{index}}'>&#x25BA</td>
<td>{{name}}</td>
<td style='text-align: left'>{{osc1.fileName}}</td>
<td>{{fmttime osc1.zone.startMilliseconds}}</td>
<td>{{fmttime osc1.zone.endMilliseconds}}</td>
<td>{{osc2.fileName}}</td>
<td>{{fmttime osc2.zone.startMilliseconds}}</td>
<td>{{fmttime osc2.zone.endMilliseconds}}</td>

</tr><div class='kit_spot'> <div>`);


var sound_template = Handlebars.compile(`<table class='sound_grid'>


<tr>
<th class ='toph sample1'>Sample 1</th>
<th class ='toph sample2'>Sample 2</th>
<th class ='toph unlab' colspan='4'></th>
<th class ='toph distortion'>Distortion</th>
<th class ='toph unlab'></th>

<th class ='toph lpf hleftb'>LPF</th>
<th class ='toph hpf'>HPF</th>
<th class ='toph bass'>Bass</th>
<th class ='toph treble'>Treble</th>

<th class ='toph modfx hleftb'>Mod FX</th>
<th class ='toph reverb'>Reverb</th>
<th class ='toph unlab' colspan='2'></th>


</tr>


<!-- Row 0 -->
<tr>
<th class='zone start sample1'>Start 1</th>
<th class='zone start sample2'>Start 2</th>
<th class='unlab' style='border-bottom: hidden'> </th>
<th class='unlab' style='border-bottom: hidden'> </th>

<th class='unlab' style='border-bottom: hidden'> </th>
<th class='unlab' style='border-bottom: hidden'> </th>
<th class='distortion'>Saturation</th>
<th class='unlab' style='border-bottom: hidden'> </th>

<th class='lpf frequency hleftb'>LPF Freq</th>
<th class='hpf frequency'>HPF Freq</th>
<th class='frequency bass'>Bass</th>
<th class='frequency treble'>Treble</th>

<th class='modfx hleftb'>Rate</th>
<th class='reverb'>Room Size</th>
<th class='unlab' style='border-bottom: hidden'> </th>
<th class='unlab' style='border-bottom: hidden'> </th>
</tr>

<tr>
<td class='zone start sample1'>{{fmttime osc1.zone.startMilliseconds}}</td>
<td class='zone start sample2'>{{fmttime osc2.zone.startMilliseconds}}</td>
<td class='unlab'>{{c03}}</td>
<td class='unlab'>{{c04}}</td>

<td class='unlab'>{{c05}}</td>
<td class='unlab'>{{c06}}</td>
<td class='distortion'>{{c07}}</td>
<td class='unlab'>{{c08}}</td>

<td class='lpf frequency hleftb'>{{fixh lpfFrequency}}</td>
<td class='hpf frequency'>{{fixh hpfFrequency}}</td>
<td class='frequency bass'>{{fixh equalizer.bassFrequency}}</td>
<td class='frequency treble'>{{fixh equalizer.trebleFrequency}}</td>

<td class='modfx hleftb'>{{fixh modFXRate}}</td>
<td class='reverb'>{{fixrev reverb.roomSize}}</td>
<td class='unlab'>{{c15}}</td>
<td class='unlab'>{{c16}}</td>
</tr>

<!-- Row 1 -->




<tr>
<th class='zone end sample1'>End 1</th>
<th class='zone end sample2'>End 2</th>
<th class='noise'>Noise</th>
<th class='osc2'>Osc Sync</th>

<th class='destination fmmod1 hleftb'>Dest M 1</th>
<th class='destination fmmod2'>Dest M 2</th>
<th class='distortion'>Bitcrush</th>
<th class='unlab' style='border-bottom: hidden'> </th>

<th class='lpf resonance hleftb'>LPF Reson</th>
<th class='hpf resonance'>HPF Reson</th>
<th class='bass adjust'>Adj Bass</th>
<th class='treble adjust'>Adj Treble</th>

<th class='modfx hleftb'>Depth</th>
<th class='reverb'>Dampening</th>
<th class='modsources'>Env 1</th>
<th class='modsources'>Env 2</th>
</tr>

<tr>
<td class='zone end sample1'>{{fmttime osc1.zone.endMilliseconds}}</td>
<td class='zone end sample2'>{{fmttime osc2.zone.endMilliseconds}}</td>
<td class='noise'>{{fixh noiseVolume}}</td>
<td class='osc2'>{{c20}}</td>

<td class='destination fmmod1 hleftb'>{{c21}}</td>
<td class='destination fmmod2'>{{c22}}</td>
<td class='distortion'>{{fixh bitCrush}}</td>
<td class='unlab'> </th>

<td class='lpf resonance hleftb'>{{fixh lpfResonance}}</td>
<td class='hpf resonance'>{{fixh hpfResonance}}</td>
<td class='bass adjust'>{{fixh equalizer.bass}}</td>
<td class='treble adjust'>{{fixh equalizer.treble}}</td>

<td class='modfx hleftb'>{{fixh modFXDepth}}</td>
<td class='reverb'>{{fixrev reverb.dampening}}</td>
<td class='textsm modsources m_envelope1'>{{m_envelope1}}</td>
<td class='textsm modsources m_envelope2'>{{m_envelope2}}</td>
</tr>

<!-- Row 2 -->
<tr>
<th class='audio browse sample1'>Browse 1</th>
<th class='audio browse sample2'>Browse 2</th>
<th class='osc1 feedback'>Feedbk 1</th>
<th class='osc2 feedback'>Feedbk 2</th>

<th class='fmmod1 feedback hleftb'>Feedbk M 1</th>
<th class='fmmod2 feedback'>Feedbk M 2</th>
<th class='distortion'>Decimation</th>
<th class='unlab' style='border-bottom: hidden'> </th>

<th class='dboct lpf hleftb'>LPF dB/O</th>
<th class='dboct hpf'>HPF dB/O</th>
<th class='sidechain'>Send</th>
<th class='unlab' style='border-bottom: hidden'> </th>

<th class='modfx hleftb'>Feedback</th>
<th class='reverb'>Width</th>
<th class='modsources'>LFO 1</th>
<th class='modsources'>LFO 2</th>
</tr>

<tr>
<td class='audio browse sample1'>{{c33}}</td>
<td class='audio browse sample2'>{{c34}}</td>
<td class='osc1 feedback'>{{fixh carrier1Feedback}}</td>
<td class='osc2 feedback'>{{fixh carrier2Feedback}}</td>
              
<td class='fmmod1 feedback hleftb'>{{fixh modulator1Feedback}}</td>
<td class='fmmod2 feedback'>{{fixh modulator2Feedback}}</td>
<td class='distortion'>{{c39}}</td>
<th class='unlab' style='border-bottom: hidden'> </th>

<td class='dboct lpf hleftb'>{{lpfMode}}</td>
<td class='dboct hpf'>{{hpfMode}}</td>
<td class='sidechain'>{{fixrev sideChainSend}}</td>
<td class='unlab'>{{c44}}</td>

<td class='modfx hleftb'>{{fixh modFXFeedback}}</td>
<td class='reverb'>{{fixrev reverb.width}}</td>
<td class='textsm modsources m_lfo1'>{{m_lfo1}}</td>
<td class='textsm modsources m_lfo2'>{{m_lfo2}}</td>
</tr>

<!-- Row 3 -->
<tr>
<th class='audio record sample1'>Record 1</th>
<th class='audio record sample2'>Record 2</th>
<th class='osc1 retrigphase'>Retrig 1</th>
<th class='osc2 retrigphase'>Retrig 2</th>

<th class='fmmod1 hleftb retrigphase'>Retrig M 1</th>
<th class='fmmod2 retrigphase'>Retrig M 2</th>
<th class='master'>Synth Mode</th>
<th class='unison'>Unison #</th>

<th class='unlab hleftb' style='border-bottom: hidden'> </th>
<th class='unlab' style='border-bottom: hidden'> </th>
<th class='sidechain'>Shape</th>
<th class='arp'>Arp Mode</th>

<th class='modfx hleftb'>Offset</th>
<th class='reverb'>Pan</th>
<th class='delay'>Stereo</th>
<th class='modsources'>Sidechain</th>
</tr>

<tr>
<td class='audio record sample1'>{{c49}}</td>
<td class='audio record sample2'>{{c50}}</td>
<td class='osc1 retrigphase'>{{fixphase osc1.retrigPhase}}</td>
<td class='osc2 retrigphase'>{{fixphase osc2.retrigPhase}}</td>
              
<td class='fmmod1 retrigphase hleftb'>{{fixphase modulator1.retrigPhase}}</td>
<td class='fmmod2 retrigphase'>{{fixphase modulator2.retrigPhase}}</td>
<td class='master textsm'>{{mode}}</td>
<td class='unison'>{{unison.num}}</td>
              
<td class='unlab hleftb'>{{c57}}</td>
<td class='unlab'>{{c58}}</td>
<td class='sidechain'>{{fixh compressorShape}}</td>
<td class='arp'>{{c60}}</td>
              
<td class='modfx hleftb'>{{fixh modFXOffset}}</td>
<td class='reverb'>{{fixrev reverb.pan}}</td>
<td class='delay'>{{c63}}</td>
<td class='textsm modsources m_sidechain'>{{m_sidechain}}</td>
</tr>

<!-- Row 4 -->
<tr>
<th class='sample1 pitchtime'>Pitch/T 1</th>
<th class='sample2 pitchtime'>Pitch/T 2</th>
<th class='osc1 pw'>PW 1</th>
<th class='osc2 pw'>PW 2</th>

<th class='fmmod1 pw hleftb'>PW M 1</th>
<th class='fmmod2 pw'>PW M 2</th>
<th class='master'>Master Pan</th>
<th class='unison'>Detune</th>

<th class='attack env1 hleftb'>Attack 1</th>
<th class='attack env2'>Attack 2</th>
<th class='attack sidechain'>Attack SC</th>
<th class='arp'>Arp Octs</th>

<th class='modfx hleftb'>Type</th>
<th class='reverb amount'>Reverb Amt</th>
<th class='delay amount'>Delay Amt</th>
<th class='modsources'>Note</th>
</tr>


<tr>
<td class='sample1 pitchtime'>{{osc1.timeStretchEnable}}</td>
<td class='sample2 pitchtime'>{{osc1.timeStretchEnable}}</td>
<td class='osc1 pw'>{{fixh oscAPulseWidth}}</td>
<td class='osc2 pw'>{{fixh oscBPulseWidth}}</td>
              
<td class='fmmod1 pw hleftb'>{{c69}}</td>
<td class='fmmod2 pw'>{{c70}}</td>
<td class='master'>{{fixpan pan}}</td>
<td class='unison'>{{unison.detune}}</td>
              
<td class='attack env1 hleftb'>{{fixh envelope1.attack}}</td>
<td class='attack env2'>{{fixh envelope2.attack}}</td>
<td class='attack sidechain'>{{fixrev compressor.attack}}</td>
<td class='arp'>{{c76}}</td>
              
<td class='modfx hleftb'>{{modFXType}}</td>
<td class='reverb amount'>{{fixh reverbAmount}}</td>
<td class='delay amount'>{{fixh delayFeedback}}</td>
<td class='textsm modsources m_note'>{{m_note}}</td>
</tr>

<!-- Row 5 -->
<tr>
<th class='sample1 speed'>Speed 1</th>
<th class='sample2 speed'>Speed 2</th>
<th class='osc1 type'>Type 1</th>
<th class='osc2 type'>Type 2</th>

<th class='fmmod1 type hleftb'>Type M 1</th>
<th class='fmmod2 type'>Type M 2</th>
<th class='master'>Vibrato</th>
<th class='voice'>Priority</th>

<th class='env1 decay hleftb'>Decay 1</th>
<th class='env2 decay'>Decay 2</th>
<th class='sidechain'>Vol Duck</th>
<th class='arp'>Gate</th>

<th class='lfo1 shape hleftb'>LFO 1 Shape</th>
<th class='lfo2 shape'>LFO 2 Shape</th>
<th class='delay'>Analog</th>
<th class='modsources'>Random</th>
</tr>

<tr>
<td class='sample1 speed'>{{fixh osc1.timeStretchAmount}}</td>
<td class='sample2 speed'>{{fixh osc2.timeStretchAmount}}</td>
<td class='osc1 type'>{{osc1.type}}</td>
<td class='osc2 type'>{{osc2.type}}</td>
              
<td class='fmmod1 type hleftb'>{{c85}}</td>
<td class='fmmod2 type'>{{c86}}</td>
<td class='master'>{{fixh c87}}</td>
<td class='voice'>{{voicePriority}}</td>
              
<td class='env1 decay hleftb'>{{fixh envelope1.decay}}</td>
<td class='env2 decay'>{{fixh envelope2.decay}}</td>
<td class='sidechain'>{{fixh compressor.decay}}</td>
<td class='arp'>{{c92}}</td>
              
<td class='lfo1 shape hleftb'>{{lfo1.type}}</td>
<td class='lfo2 shape'>{{lfo2.type}}</td>
<td class='delay'>{{fixh delay.analog}}</td>
<td class='textsm modsources m_random'>{{m_random}}</td>
</tr>

<!-- Row 6 -->
<tr>
<th class='sample1 reverse'>Reverse 1</th>
<th class='sample2 reverse'>Reverse 2</th>
<th class='osc1 transpose'>Trans 1</th>
<th class='osc2 transpose'>Trans 2</th>

<th class='fmmod1 transpose hleftb'>Trans M 1</th>
<th class='fmmod2 transpose'>Trans M 2</th>
<th class='master transpose'>Trans Master</th>
<th class='voice'>Poly</th>

<th class='env1 sustain hleftb'>Sustain 1</th>
<th class='env2 sustain'>Sustain 2</th>
<th class='sidechain'>SC Sync</th>
<th class='arp sync'>Arp Sync</th>

<th class='lfo1 sync hleftb'>LFO 1 Sync</th>
<th class='lfo2 sync'>LFO 2 Sync</th>
<th class='delay sync'>Delay Sync</th>
<th class='modsources'>Velocity</th>
</tr>

<tr>
<td class='sample1 reverse'>{{osc1.reversed}}</td>
<td class='sample2 reverse'>{{osc2.reversed}}</td>
<td class='osc1 transpose'>{{osc1.transpose}}</td>
<td class='osc2 transpose'>{{osc2.transpose}}</td>
              
<td class='fmmod1 transpose hleftb'>{{modulator1.transpose}}</td>
<td class='fmmod2 transpose'>{{modulator2.transpose}}</td>
<td class='master transpose'>{{c103}}</td>
<td class='voice'>{{polyphonic}}</td>
              
<td class='env1 sustain hleftb'>{{fixh envelope1.sustain}}</td>
<td class='env2 sustain'>{{fixh envelope2.sustain}}</td>
<td class='sidechain'>{{compressor.syncLevel}}</td>
<td class='arp sync'>{{c108}}</td>
              
<td class='lfo1 sync hleftb'>{{lfo1.syncLevel}}</td>
<td class='lfo2 sync'>{{lfo2.syncLevel}}</td>
<td class='delay sync '>{{delay.syncLevel}}</td>
<td class='textsm modsources m_velocity'>{{m_velocity}}</td>
</tr>

<!-- Row 7 -->
<tr>
<th class='sample1 mode'>Mode 1</th>
<th class='sample2 mode'>Mode 2</th>
<th class='osc1 volume'>Vol 1</th>
<th class='osc2 volume'>Vol 2</th>

<th class='fmmod1 volume hleftb'>Vol M 1</th>
<th class='fmmod2 volume'>Vol M 2</th>
<th class='master volume'>Vol Master</th>
<th class='voice'>Porta</th>

<th class='env1 release hleftb'>Release 1</th>
<th class='env2 release'>Release 2</th>
<th class='sidechain release'>Release SC</th>
<th class='arp rate'>Arp Rate</th>

<th class='lfo1 rate hleftb'>LFO 1 Rate</th>
<th class='lfo2 rate'>LFO 2 Rate</th>
<th class='rate delay'>Delay Rate</th>
<th class='modsources'>Aftertouch</th>
</tr>

<tr>
<td class='sample1 mode'>{{osc1.loopMode}}</td>
<td class='sample2 mode'>{{osc2.loopMode}}</td>
<td class='osc1 volume'>{{fixh oscAVolume}}</td>
<td class='osc2 volume'>{{fixh oscBVolume}}</td>

<td class='fmmod1 volume hleftb'>{{fixh modulator1Amount}}</td>
<td class='fmmod2 volume'>{{fixh modulator2Amount}}</td>
<td class='master volume'>{{fixh volume}}</td>
<td class='voice'>{{fixh portamento}}</td>

<td class='env1 release hleftb'>{{fixh envelope1.release}}</td>
<td class='env2 release'>{{fixh envelope2.release}}</td>
<td class='sidechain release'>{{compressor.release}}</td>
<td class='arp rate'>{{fixh arpeggiatorRate}}</td>

<td class='lfo1 rate hleftb'>{{fixh lfo1Rate}}</td>
<td class='lfo2 rate'>{{fixh lfo2Rate}}</td>
<td class='rate delay '>{{fixh delayRate}}</td>
<td class='textsm modsources m_aftertouch'>{{m_aftertouch}}</td>
</tr>

<tr>
<th class ='both sample1'>Sample 1</th>
<th class ='both sample2'>Sample 2</th>
<th class ='both osc1'>Osc 1</th>
<th class ='both osc1'>Osc 2</th>

<th class ='both fmmod1 hleftb'>FM Mod 1</th>
<th class ='both fmmod2'>FM Mod 2</th>
<th class ='both master'>Volume</th>
<th class ='both voice'>Voice</th>
<th class ='both env1 release hleftb'>Envelope 1</th>
<th class ='both env2 release'>Envelope 2</th>
<th class ='both sidechain'>Sidechain</th>
<th class ='both arp'>Arp</th>
<th class ='both lfo1 hleftb'>LFO 1</th>
<th class ='both lfo1'>LFO 2</th>
<th class ='toph delay'>Delay</th>
<th class ='toph modsources'>Mod Source</th>

</tr>


</table><p/>`);

// **** Thats all for the sound table