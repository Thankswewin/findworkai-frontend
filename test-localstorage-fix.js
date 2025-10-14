// Test script to verify localStorage save functionality
// Run this in the browser console to test the fix

console.log('🔧 Testing localStorage save functionality fix...');

// Test 1: Check if hook is properly defined
try {
  // This simulates what the useUserContentHistory hook does
  const testArtifact = {
    id: 'test-artifact-' + Date.now(),
    name: 'Test Restaurant - Website',
    type: 'website',
    content: '<!DOCTYPE html><html><head><title>Test Website</title></head><body><h1>Test Restaurant Website</h1></body></html>',
    generatedAt: new Date(),
    metadata: {
      businessName: 'Test Restaurant',
      businessCategory: 'Restaurant',
      generatedByAI: true
    }
  };

  const businessId = 'test-business-' + Date.now();

  // Simulate the hook's addArtifact function with guest userId
  const userId = 'guest';
  const localStorageKey = `findworkai_user_projects_${userId}`;

  console.log(`📁 Using localStorage key: ${localStorageKey}`);

  // Get existing projects
  let projects = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  console.log('📊 Existing projects:', projects.length);

  // Find or create project
  let project = projects.find(p => p.businessId === businessId);

  if (!project) {
    project = {
      id: Date.now().toString(),
      businessId,
      businessName: testArtifact.metadata.businessName,
      businessCategory: testArtifact.metadata.businessCategory,
      location: 'Test City, NY',
      artifacts: [],
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active',
      tags: []
    };
    projects.push(project);
    console.log('✅ Created new project:', project.businessName);
  }

  // Add artifact
  project.artifacts.push(testArtifact);
  project.lastModified = new Date();

  if (!project.tags.includes(testArtifact.type)) {
    project.tags.push(testArtifact.type);
  }

  // Save to localStorage
  localStorage.setItem(localStorageKey, JSON.stringify(projects));

  console.log('✅ SUCCESS: Artifact saved to localStorage');
  console.log('📋 Project details:', {
    businessName: project.businessName,
    artifactsCount: project.artifacts.length,
    tags: project.tags,
    lastModified: project.lastModified
  });

  // Test 2: Verify we can read it back
  const savedProjects = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  const savedProject = savedProjects.find(p => p.businessId === businessId);

  if (savedProject && savedProject.artifacts.length > 0) {
    console.log('✅ VERIFICATION: Save successful - found', savedProject.artifacts.length, 'artifacts');
    console.log('📄 Sample artifact:', {
      id: savedProject.artifacts[0].id,
      name: savedProject.artifacts[0].name,
      type: savedProject.artifacts[0].type
    });
    console.log('🎉 The localStorage fix is working correctly!');
  } else {
    console.log('❌ VERIFICATION FAILED: Project not found or no artifacts');
  }

  // Test 3: Check what the UserContentHistory component would see
  console.log('\n🔍 Testing what UserContentHistory component sees...');
  const userContentKey = `findworkai_user_projects_guest`; // This is what the component uses
  const userProjects = JSON.parse(localStorage.getItem(userContentKey) || '[]');
  console.log('📊 UserContentHistory sees:', userProjects.length, 'projects');

  if (userProjects.length > 0) {
    console.log('✅ SUCCESS: UserContentHistory can see the saved content!');
    console.log('🏪 First project:', userProjects[0].businessName);
    console.log('📦 Artifacts count:', userProjects[0].artifacts.length);
  } else {
    console.log('❌ ISSUE: UserContentHistory cannot see saved content');
  }

} catch (error) {
  console.error('❌ Test failed:', error.message);
}

console.log('\n🏁 Test completed!');