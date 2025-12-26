
export interface Range {
  start: number;
  end: number;
}

export function findPathRange(json: string, path: string[]): Range | null {
  let index = 0;
  const targetPath = path.slice(1); // Remove 'root'

  const skipWhitespace = () => {
    while (index < json.length && /\s/.test(json[index])) {
      index++;
    }
  };

  const parseString = (): boolean => {
    if (json[index] !== '"') return false;
    index++;
    while (index < json.length) {
      if (json[index] === '\\') {
        index += 2;
      } else if (json[index] === '"') {
        index++;
        return true;
      } else {
        index++;
      }
    }
    return false;
  };

  const parseNumber = () => {
    if (json[index] === '-') index++;
    while (index < json.length && /[0-9]/.test(json[index])) index++;
    if (json[index] === '.') {
      index++;
      while (index < json.length && /[0-9]/.test(json[index])) index++;
    }
    if (json[index] === 'e' || json[index] === 'E') {
      index++;
      if (json[index] === '+' || json[index] === '-') index++;
      while (index < json.length && /[0-9]/.test(json[index])) index++;
    }
  };

  const parseLiteral = (lit: string) => {
    if (json.substring(index, index + lit.length) === lit) {
      index += lit.length;
      return true;
    }
    return false;
  };

  // skipValue: parse and skip a value without tracking, returns true if successful
  const skipValue = (): boolean => {
    skipWhitespace();
    if (index >= json.length) return false;

    if (json[index] === '{') {
      index++;
      skipWhitespace();
      if (json[index] === '}') { index++; return true; }
      while (index < json.length) {
        skipWhitespace();
        if (!parseString()) return false;
        skipWhitespace();
        if (json[index] !== ':') return false;
        index++;
        if (!skipValue()) return false;
        skipWhitespace();
        if (json[index] === '}') { index++; return true; }
        if (json[index] === ',') { index++; } else { return false; }
      }
    } else if (json[index] === '[') {
      index++;
      skipWhitespace();
      if (json[index] === ']') { index++; return true; }
      while (index < json.length) {
        if (!skipValue()) return false;
        skipWhitespace();
        if (json[index] === ']') { index++; return true; }
        if (json[index] === ',') { index++; } else { return false; }
      }
    } else if (json[index] === '"') {
      return parseString();
    } else if (json[index] === 't') {
      return parseLiteral('true');
    } else if (json[index] === 'f') {
      return parseLiteral('false');
    } else if (json[index] === 'n') {
      return parseLiteral('null');
    } else if (json[index] === '-' || /[0-9]/.test(json[index])) {
      parseNumber();
      return true;
    }
    return false;
  };

  // parseValue: parse a value and track the path, returns Range if target found
  const parseValue = (currentPathDepth: number): Range | null => {
    skipWhitespace();
    const start = index;

    if (index >= json.length) return null;

    // Check if we've reached the target depth (for primitives at target)
    const isAtTarget = currentPathDepth === targetPath.length;

    if (json[index] === '{') {
      index++;
      skipWhitespace();
      if (json[index] === '}') {
        index++;
        return isAtTarget ? { start, end: index } : null;
      }
      
      while (index < json.length) {
        skipWhitespace();
        const keyStart = index;
        if (!parseString()) return null;
        const keyEnd = index;
        const key = JSON.parse(json.substring(keyStart, keyEnd));
        
        skipWhitespace();
        if (json[index] !== ':') return null;
        index++;
        
        const isTarget = currentPathDepth < targetPath.length && targetPath[currentPathDepth] === key;
        
        if (isTarget) {
          // This key matches the current target path segment
          const nextDepth = currentPathDepth + 1;
          if (nextDepth === targetPath.length) {
            // We've reached the final target - return range including key
            skipWhitespace();
            if (!skipValue()) return null;
            // Return range from key start to value end, including key for highlighting
            return { start: keyStart, end: index };
          } else {
            // Need to go deeper
            const result = parseValue(nextDepth);
            if (result) return result;
          }
        } else {
          // Not on target path, just skip this value
          if (!skipValue()) return null;
        }

        skipWhitespace();
        if (json[index] === '}') {
          index++;
          return isAtTarget ? { start, end: index } : null;
        }
        if (json[index] === ',') {
          index++;
        } else {
          return null;
        }
      }
    } else if (json[index] === '[') {
      index++;
      skipWhitespace();
      if (json[index] === ']') {
        index++;
        return isAtTarget ? { start, end: index } : null;
      }

      let arrayIndex = 0;
      while (index < json.length) {
        const isTarget = currentPathDepth < targetPath.length && targetPath[currentPathDepth] === String(arrayIndex);
        
        if (isTarget) {
          const nextDepth = currentPathDepth + 1;
          if (nextDepth === targetPath.length) {
            // This array element is the target
            skipWhitespace();
            const valueStart = index;
            if (!skipValue()) return null;
            return { start: valueStart, end: index };
          } else {
            // Need to go deeper
            const result = parseValue(nextDepth);
            if (result) return result;
          }
        } else {
          if (!skipValue()) return null;
        }

        arrayIndex++;
        skipWhitespace();
        if (json[index] === ']') {
          index++;
          return isAtTarget ? { start, end: index } : null;
        }
        if (json[index] === ',') {
          index++;
        } else {
          return null;
        }
      }
    } else if (json[index] === '"') {
      parseString();
      return isAtTarget ? { start, end: index } : null;
    } else if (json[index] === 't') {
      parseLiteral('true');
      return isAtTarget ? { start, end: index } : null;
    } else if (json[index] === 'f') {
      parseLiteral('false');
      return isAtTarget ? { start, end: index } : null;
    } else if (json[index] === 'n') {
      parseLiteral('null');
      return isAtTarget ? { start, end: index } : null;
    } else if (json[index] === '-' || /[0-9]/.test(json[index])) {
      parseNumber();
      return isAtTarget ? { start, end: index } : null;
    }
    
    return null;
  };

  if (targetPath.length === 0) {
    // Root - parse entire value
    skipWhitespace();
    const start = index;
    if (skipValue()) {
      return { start, end: index };
    }
    return null;
  }

  return parseValue(0);
}
