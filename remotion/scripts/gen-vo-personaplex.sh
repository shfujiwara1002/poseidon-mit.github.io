#!/usr/bin/env bash
#
# gen-vo-personaplex.sh — Generate voiceover using NVIDIA PersonaPlex-7B
#
# PersonaPlex is a speech-to-speech model. For narration generation we use
# its offline mode: provide a short voice-prompt clip + a text role-prompt
# containing the narration script, and a minimal "cue" input audio.
#
# Prerequisites:
#   1. Clone PersonaPlex:  git clone https://github.com/NVIDIA/personaplex.git
#   2. Install:            cd personaplex && pip install moshi/.
#   3. macOS:              brew install opus
#   4. Set HF token:       export HF_TOKEN=<your_token>
#   5. Accept model license at https://huggingface.co/nvidia/personaplex-7b-v1
#
# Usage:
#   ./scripts/gen-vo-personaplex.sh [--voice NATF2|NATM1] [--output path.wav]
#
# The script generates a 30s narration for the Poseidon hero demo video.
# Output: remotion/public/audio/vo-hero-demo.wav (24kHz WAV)
#
set -euo pipefail

VOICE_PROMPT="${1:-NATF2}"  # NATF2 = female, NATM1 = male
OUTPUT="${2:-$(dirname "$0")/../public/audio/vo-hero-demo.wav}"

# Narration script as role/text prompt
TEXT_PROMPT="You are a professional product narrator for Poseidon AI, a wealth intelligence platform. \
Speak in a calm, confident, Apple-keynote style. Pace yourself clearly. \
Read this narration script exactly: \

Poseidon. AI-native wealth intelligence. \
Four engines working together to protect, grow, execute, and govern your financial decisions. \
Protect detects threats before they land. \
Grow forecasts tomorrow's opportunities today. \
Execute turns decisions into one-tap approvals. \
Govern logs every action — fully auditable, fully reversible. \
Try Poseidon at poseidon-mit.github.io."

# Generate a 30s silent cue audio (24kHz mono) for offline mode input
CUE_WAV="$(mktemp /tmp/personaplex-cue-XXXX.wav)"
python3 -c "
import wave, struct
sr, dur = 24000, 30
with wave.open('${CUE_WAV}', 'w') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sr)
    # near-silence (tiny noise to avoid zero-input edge cases)
    import random
    frames = [struct.pack('<h', random.randint(-10, 10)) for _ in range(sr * dur)]
    w.writeframes(b''.join(frames))
print('Cue audio generated: ${CUE_WAV}')
"

echo "=== PersonaPlex VO Generation ==="
echo "Voice:  ${VOICE_PROMPT}"
echo "Output: ${OUTPUT}"
echo ""

# Run PersonaPlex offline mode
python3 -m moshi.offline \
  --voice-prompt "${VOICE_PROMPT}.pt" \
  --text-prompt "${TEXT_PROMPT}" \
  --input-wav "${CUE_WAV}" \
  --output-wav "${OUTPUT}" \
  ${HF_TOKEN:+--hf-token "${HF_TOKEN}"}

# Clean up
rm -f "${CUE_WAV}"

echo ""
echo "=== Done ==="
echo "VO saved to: ${OUTPUT}"
echo ""
echo "To use in Remotion, set the voSrc prop:"
echo '  <PoseidonHeroDemo voSrc="audio/vo-hero-demo.wav" />'
