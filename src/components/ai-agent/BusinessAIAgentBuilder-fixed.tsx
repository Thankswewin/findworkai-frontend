// This is a fixed version with proper timeout handling
// Changes needed in BusinessAIAgentBuilder.tsx around line 223-245:

// REPLACE THIS SECTION:
/*
        // Create AbortController for timeout management
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 180000) // 3 minutes
        
        const response = await fetch(`${backendUrl}/mcp-enhanced/generate-enhanced`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            business_info: businessInfo,
            enable_mcp: true,
            enable_self_reflection: true,
            enable_self_correction: true,
            max_iterations: 3,
            framework: 'html',
            style_preference: 'modern'
          }),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
*/

// WITH THIS:
        // Create AbortController with longer timeout for AI generation
        const controller = new AbortController()
        // Increase timeout to 10 minutes for complex AI generation
        const timeoutId = setTimeout(() => controller.abort(), 600000) // 10 minutes
        
        // Add retry logic for network issues
        let retries = 0;
        let response;
        
        while (retries < 3) {
          try {
            response = await fetch(`${backendUrl}/mcp-enhanced/generate-enhanced`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                business_info: businessInfo,
                enable_mcp: true,
                enable_self_reflection: true,
                enable_self_correction: true,
                max_iterations: 2, // Reduce iterations to speed up
                framework: 'html',
                style_preference: 'modern'
              }),
              signal: controller.signal
            })
            
            // If we get a response, break the retry loop
            break;
          } catch (error: any) {
            if (error.name === 'AbortError') {
              // If aborted by timeout, don't retry
              throw new Error('Generation is taking too long. The AI service might be overloaded. Please try again with simpler requirements.');
            }
            
            retries++;
            if (retries >= 3) {
              throw new Error('Network error: Unable to reach the AI service. Please check your connection and try again.');
            }
            
            // Wait before retrying
            setCurrentStep(`Network issue detected. Retrying (${retries}/3)...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        
        clearTimeout(timeoutId)

// ALSO ADD A PROGRESS INDICATOR:
        // Add periodic progress updates while waiting
        let progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev < 70) return prev + 5;
            return prev;
          });
          
          // Update step message to show it's still working
          const steps = [
            'AI is analyzing business requirements...',
            'Generating custom content...',
            'Applying optimizations...',
            'Finalizing your solution...'
          ];
          const stepIndex = Math.floor(Math.random() * steps.length);
          setCurrentStep(steps[stepIndex]);
        }, 3000);
        
        // Clear interval when done
        try {
          // ... rest of the code
        } finally {
          clearInterval(progressInterval);
        }
